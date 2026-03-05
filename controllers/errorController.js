const AppError = require('../utils/appErrors');
const { sendError } = require('../utils/response');

// Handle Error Functions

const handleCastError = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((val) => val.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleJsonWebTokenError = () =>
  new AppError('Invalid token, please login again', 401);

const handleTokenExpiredError = () =>
  new AppError('Token has expired, please login again', 401);

// Error Controller – unified format: { status: false, statusCode, message, data }
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV === 'production') {
    let error = JSON.parse(JSON.stringify(err));
    error.message = err.message;
    if (error.name === 'CastError') error = handleCastError(error);
    if (error.name === 'ValidationError') error = handleValidationError(error);
    if (error.name === 'JsonWebTokenError') error = handleJsonWebTokenError(error);
    if (error.name === 'TokenExpiredError') error = handleTokenExpiredError(error);
    const message = error.isOperational ? error.message : 'Something went very wrong';
    const data = error.isOperational ? null : { stack: error.stack };
    sendError(res, error.statusCode, message, data);
  } else {
    sendError(res, err.statusCode, err.message, { stack: err.stack });
  }
};