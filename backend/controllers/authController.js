// backend/controllers/authController.js
const supabase = require('../db/supabaseClient');
const { createClient } = require('@supabase/supabase-js');

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

    // Create a local client for login to avoid mutating the global service-role client
    // and leaking sessions across requests.
    const localSupabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY, // We can use service key here just as an API key, GoTrue doesn't care for password grant
      { auth: { persistSession: false, autoRefreshToken: false } }
    );

    const { data, error } = await localSupabase.auth.signInWithPassword({
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
      console.error('Profile fetch error:', profileError);
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
