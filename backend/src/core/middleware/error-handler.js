const { AppError } = require('../errors/AppError');
const { HttpStatus } = require('../errors/http-status');
const { env } = require('../../config/env');

function errorHandler(err, _req, res, _next) {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        message: err.message,
      },
    });
  }

  if (err.name === 'ZodError') {
    return res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Geçersiz istek verisi.',
        details: err.issues,
      },
    });
  }

  console.error('[UnhandledError]', err);

  return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message:
        env.nodeEnv === 'production'
          ? 'Beklenmeyen bir hata oluştu.'
          : err.message,
    },
  });
}

module.exports = { errorHandler };
