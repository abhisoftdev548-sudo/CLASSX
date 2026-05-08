export const errorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";



  if (err.code === 11000) {
    err.statusCode = 400;
    err.message = `Duplicate field value entered for ${Object.keys(err.keyValue)} field.`;
  }

  if (err.name === "TokenExpiredError") {
    err.statusCode = 401;
    err.message = "Your session has expired, please login again.";
  }

  if (err.name === "JsonWebTokenError") {
    err.statusCode = 401;
    err.message = "Invalid token, please login again.";
  }

  return res.status(err.statusCode).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
};
