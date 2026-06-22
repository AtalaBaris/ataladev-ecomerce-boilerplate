const { HttpStatus } = require('../../../core/errors/http-status');
const { AuthService } = require('../services/auth.service');

const authService = new AuthService();

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
      const result = await authService.login(req.validated);
      return res.status(HttpStatus.OK).json({
        success: true,
        data: result,
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
}

module.exports = { AuthController };
