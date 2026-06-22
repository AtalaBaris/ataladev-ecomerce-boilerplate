const jwt = require('jsonwebtoken');
const { AppError } = require('../../../core/errors/AppError');
const { HttpStatus } = require('../../../core/errors/http-status');
const { env } = require('../../../config/env');

function authenticate(req, _res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(
      new AppError(
        'Kimlik doğrulama gerekli.',
        HttpStatus.UNAUTHORIZED,
        'UNAUTHORIZED',
      ),
    );
  }

  const token = authHeader.slice(7);

  try {
    const payload = jwt.verify(token, env.jwt.secret);
    req.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };
    return next();
  } catch {
    return next(
      new AppError(
        'Geçersiz veya süresi dolmuş token.',
        HttpStatus.UNAUTHORIZED,
        'INVALID_TOKEN',
      ),
    );
  }
}

module.exports = { authenticate };