import { ErrorRequestHandler } from 'express';
import config from '../../config';

const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  console.error(error);

  res.statusCode = error.status || statusCode;

  if (!config.isProduction) {
    return res.json({
      error: {
        message: error.message,
        stack: error.stack,
      },
    });
  }

  return res.status(statusCode).send({
    success: false,
    error: {
      message: 'Something went wrong',
    },
  });
};

export default errorHandler;
