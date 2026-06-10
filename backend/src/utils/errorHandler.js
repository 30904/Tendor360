// Custom error handler utility
const catchAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Export the catchAsync function for use in controllers
module.exports = { catchAsync };
