/**
 * Async Handler - Wrapper for async route handlers
 * Automatically catches errors and passes them to express error middleware
 */

const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
