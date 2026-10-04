import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Verify the Bearer token and attach authenticated user to req.user
export const protect = async (req, res, next) => {
  let token;

  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (authHeader && authHeader.startsWith('Bearer')) {
    try {
      token = authHeader.split(' ')[1].trim();

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'openforge_jwt_fallback_secret'
      );

      // Support common JWT ID property variations
      const userId = decoded.id || decoded._id || decoded.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Invalid token structure: missing user identifier.',
        });
      }

      req.user = await User.findById(userId).select('-password');

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'User no longer exists or session has expired.',
        });
      }

      // Check account activation (defaults to true if undefined)
      if (req.user.isActive === false) {
        return res.status(403).json({
          success: false,
          message: 'Account is deactivated. Contact an admin.',
        });
      }

      return next();
    } catch (error) {
      console.error('[AuthMiddleware] Token verification failed:', error.message);
      return res.status(401).json({
        success: false,
        message: 'Not authorized: token verification failed or expired.',
      });
    }
  }

  return res.status(401).json({
    success: false,
    message: 'Access denied: No Bearer token provided in headers.',
  });
};

// Check if req.user role matches one of the allowed roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: role '${req.user?.role || 'unknown'}' does not have sufficient permissions.`,
      });
    }
    next();
  };
};