const { AppError } = require('../../../core/errors/AppError');
const { HttpStatus } = require('../../../core/errors/http-status');
const { ADMIN_ROLES } = require('../constants/roles');

function requireAdmin(req, _res, next) {
  if (!req.user) {
    return next(
      new AppError(
        'Kimlik doğrulama gerekli.',
        HttpStatus.UNAUTHORIZED,
        'UNAUTHORIZED',
      ),
    );
  }

  if (!ADMIN_ROLES.includes(req.user.role)) {
    return next(
      new AppError(
        'Bu işlem için yönetici yetkisi gerekli.',
        HttpStatus.FORBIDDEN,
        'FORBIDDEN',
      ),
    );
  }

  return next();
}

module.exports = { requireAdmin };
