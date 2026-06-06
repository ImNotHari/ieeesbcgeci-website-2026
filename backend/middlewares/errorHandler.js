// backend/middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] Error:`, err.message);

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'An unexpected server error occurred.';

  return res.status(statusCode).json({
    success: false,
    error: message,
    code: statusCode
  });
};

module.exports = errorHandler;
