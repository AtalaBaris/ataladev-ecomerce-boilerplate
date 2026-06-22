const { AppError } = require('../../../core/errors/AppError');
const { HttpStatus } = require('../../../core/errors/http-status');
const { env } = require('../../../config/env');

function registerGuard(_req, _res, next) {
  if (env.nodeEnv === 'production' && !env.auth.enablePublicRegister) {
    return next(
      new AppError(
        'İstenen kaynak bulunamadı.',
        HttpStatus.NOT_FOUND,
        'NOT_FOUND',
      ),
    );
  }
  return next();
}

module.exports = { registerGuard };
