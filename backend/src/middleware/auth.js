/**
 * auth.js — JWT authentication middleware.
 *
 * Verifies the Bearer token in the Authorization header.
 * Attaches the decoded user payload to req.user.
 *
 * Usage:
 *   router.post('/recipes', protect, authorize('admin'), createRecipe);
 */
const User = require('../models/User');
const AppError = require('../utils/AppError');
const { verifyToken } = require('../utils/tokenHelper');

/**
 * protect — rejects requests without a valid JWT.
 */
async function protect(req, _res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('Authentication required — no token provided', 401);
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    // Attach the live user document (excludes password)
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      throw new AppError('User not found — token may be stale', 401);
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
}

/**
 * authorize — role-based access control.
 *
 * @param {...string} roles — allowed roles, e.g. authorize('admin')
 *
 * Must be used AFTER protect.
 */
function authorize(...roles) {
  return (req, _res, next) => {
    if (!roles.includes(req.user?.role)) {
      return next(
        new AppError(
          `Access denied — requires role: ${roles.join(' or ')}`,
          403
        )
      );
    }
    next();
  };
}

module.exports = { protect, authorize };
