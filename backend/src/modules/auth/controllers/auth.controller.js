const { HttpStatus } = require('../../../core/errors/http-status');
const { getClientIp, getUserAgent } = require('../../../utils/request-meta');
const { AuthService } = require('../services/auth.service');

const authService = new AuthService();

function getRequestMeta(req) {
  return {
    ip: getClientIp(req),
    userAgent: getUserAgent(req),
  };
}

class AuthController {
  async register(req, res, next) {
    try {
      const result = await authService.register(req.validated);
      return res.status(HttpStatus.CREATED).json({
        success: true,
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  }

  async login(req, res, next) {
    try {
      const result = await authService.login(req.validated, getRequestMeta(req));
      return res.status(HttpStatus.OK).json({
        success: true,
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  }

  async adminLogin(req, res, next) {
    try {
      const result = await authService.adminLogin(
        req.validated,
        getRequestMeta(req),
      );
      return res.status(HttpStatus.OK).json({
        success: true,
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  }

  async refresh(req, res, next) {
    try {
      const result = await authService.refresh(req.validated.refreshToken);
      return res.status(HttpStatus.OK).json({
        success: true,
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  }

  async logout(req, res, next) {
    try {
      await authService.logout(req.validated?.refreshToken);
      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'Çıkış yapıldı.',
      });
    } catch (error) {
      return next(error);
    }
  }

  async me(req, res, next) {
    try {
      const user = await authService.getProfile(req.user.id);
      return res.status(HttpStatus.OK).json({
        success: true,
        data: { user },
      });
    } catch (error) {
      return next(error);
    }
  }

  async loginLogs(req, res, next) {
    try {
      const limit = Number(req.query.limit) || 50;
      const logs = await authService.getLoginLogs(limit);
      return res.status(HttpStatus.OK).json({
        success: true,
        data: { logs },
      });
    } catch (error) {
      return next(error);
    }
  }

  async forgotPassword(req, res, next) {
    try {
      const result = await authService.forgotPassword(req.validated.email);
      return res.status(HttpStatus.OK).json({
        success: true,
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  }

  async resetPassword(req, res, next) {
    try {
      const result = await authService.resetPassword(
        req.validated.token,
        req.validated.password,
      );
      return res.status(HttpStatus.OK).json({
        success: true,
        data: result,
      });
    } catch (error) {
      return next(error);
    }
  }
}

module.exports = { AuthController };
