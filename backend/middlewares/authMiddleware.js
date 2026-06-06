// backend/middleware/authMiddleware.js
const supabase = require('../db/supabaseClient');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'No authorization token provided.',
        code: 401
      });
    }

    const token = authHeader.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid or expired token.',
        code: 401
      });
    }

    // Try to get role from JWT claims (in case hook was used)
    let role = user?.app_metadata?.user_role || user?.user_metadata?.user_role || null;

    // Fallback: If hook is missing, query the profiles table directly
    if (!role) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();
      role = profile?.role || 'member'; // Default to member if not found
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: role
    };

    next();
  } catch (err) {
    console.error('Auth middleware error:', err.message);
    return res.status(500).json({
      success: false,
      error: 'Authentication service error.',
      code: 500
    });
  }
};

const requireRole = (requiredRole) => {
  return [
    authMiddleware,
    (req, res, next) => {
      if (req.user?.role !== requiredRole) {
        return res.status(403).json({
          success: false,
          error: `Access denied. Requires role: ${requiredRole}.`,
          code: 403
        });
      }
      next();
    }
  ];
};

module.exports = { authMiddleware, requireRole };
