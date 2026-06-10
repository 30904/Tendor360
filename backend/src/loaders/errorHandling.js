const setupErrorHandling = (app) => {
  // Global error handler - must be last
  app.use((error, req, res, next) => {
    console.error('Global error handler:', error);

    // Default error response
    const errorResponse = {
      error: 'Internal Server Error',
      message: 'Something went wrong on the server',
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
    };

    // Handle specific error types
    if (error.name === 'ValidationError') {
      errorResponse.error = 'Validation Error';
      errorResponse.message = 'The provided data is invalid';
      errorResponse.details = Object.values(error.errors).map(err => err.message);
      return res.status(400).json(errorResponse);
    }

    if (error.name === 'CastError') {
      errorResponse.error = 'Invalid ID';
      errorResponse.message = 'The provided ID is not valid';
      return res.status(400).json(errorResponse);
    }

    if (error.name === 'MongoError' && error.code === 11000) {
      errorResponse.error = 'Duplicate Error';
      errorResponse.message = 'A record with this information already exists';
      return res.status(409).json(errorResponse);
    }

    if (error.name === 'JsonWebTokenError') {
      errorResponse.error = 'Invalid Token';
      errorResponse.message = 'The provided token is invalid';
      return res.status(401).json(errorResponse);
    }

    if (error.name === 'TokenExpiredError') {
      errorResponse.error = 'Token Expired';
      errorResponse.message = 'The provided token has expired';
      return res.status(401).json(errorResponse);
    }

    // Handle multer errors
    if (error.code === 'LIMIT_FILE_SIZE') {
      errorResponse.error = 'File Too Large';
      errorResponse.message = 'The uploaded file exceeds the maximum allowed size';
      return res.status(400).json(errorResponse);
    }

    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      errorResponse.error = 'Unexpected File';
      errorResponse.message = 'An unexpected file field was received';
      return res.status(400).json(errorResponse);
    }

    // Generic server error
    res.status(500).json(errorResponse);
  });

  // 404 handler for API only (SPA routes handled by staticFrontend loader)
  app.use('/api/*', (req, res) => {
    res.status(404).json({
      error: 'Not Found',
      message: `The requested route ${req.originalUrl} does not exist`
    });
  });
};

module.exports = { setupErrorHandling };
