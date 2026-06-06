// backend/controllers/authController.js
const supabase = require('../db/supabaseClient');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required.',
        code: 400
      });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password.',
        code: 401
      });
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role, status, full_name')
      .eq('id', data.user.id)
      .single();

    if (profileError || !profile) {
      return res.status(403).json({
        success: false,
        error: 'User profile not found. Contact administrator.',
        code: 403
      });
    }

    if (profile.status === 'blocked') {
      return res.status(403).json({
        success: false,
        error: 'Your account has been blocked. Contact administrator.',
        code: 403
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        user: {
          id: data.user.id,
          email: data.user.email,
          full_name: profile.full_name,
          role: profile.role
        }
      },
      message: 'Login successful.'
    });
  } catch (err) {
    console.error('Login error:', err.message);
    return res.status(500).json({
      success: false,
      error: 'Login service error.',
      code: 500
    });
  }
};

const logout = async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return res.status(500).json({
        success: false,
        error: 'Logout failed.',
        code: 500
      });
    }

    return res.status(200).json({
      success: true,
      data: null,
      message: 'Logged out successfully.'
    });
  } catch (err) {
    console.error('Logout error:', err.message);
    return res.status(500).json({ success: false, error: 'Logout error.', code: 500 });
  }
};

const getMe = async (req, res) => {
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('id, email, full_name, ieee_number, semester, role, status')
      .eq('id', req.user.id)
      .single();

    if (error || !profile) {
      return res.status(404).json({
        success: false,
        error: 'Profile not found.',
        code: 404
      });
    }

    return res.status(200).json({
      success: true,
      data: profile,
      message: 'Profile fetched.'
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: 'Server error.', code: 500 });
  }
};

module.exports = { login, logout, getMe };
