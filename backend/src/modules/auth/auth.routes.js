const { Router } = require('express');
const { validate } = require('../../core/middleware/validate.middleware');
const { registerSchema } = require('./dtos/register.dto');
const { loginSchema } = require('./dtos/login.dto');
const {
  forgotPasswordSchema,
  resetPasswordSchema,
  refreshTokenSchema,
  logoutSchema,
} = require('./dtos/password-reset.dto');
const { authenticate } = require('./middleware/auth.middleware');
const { requireAdmin } = require('./middleware/require-admin.middleware');
const { registerGuard } = require('./middleware/register-guard.middleware');
const { AuthController } = require('./controllers/auth.controller');

const authRouter = Router();
const authController = new AuthController();

// Müşteri kaydı — production'da kapalı (ENABLE_PUBLIC_REGISTER=true ile açılır)
authRouter.post(
  '/register',
  registerGuard,
  validate(registerSchema),
  (req, res, next) => authController.register(req, res, next),
);

// Müşteri girişi (vitrin — ileride)
authRouter.post(
  '/login',
  validate(loginSchema),
  (req, res, next) => authController.login(req, res, next),
);

// Admin paneli girişi — yalnızca ADMIN rolü
authRouter.post(
  '/admin/login',
  validate(loginSchema),
  (req, res, next) => authController.adminLogin(req, res, next),
);

authRouter.post(
  '/admin/refresh',
  validate(refreshTokenSchema),
  (req, res, next) => authController.refresh(req, res, next),
);

authRouter.post(
  '/admin/logout',
  validate(logoutSchema),
  (req, res, next) => authController.logout(req, res, next),
);

authRouter.post(
  '/admin/forgot-password',
  validate(forgotPasswordSchema),
  (req, res, next) => authController.forgotPassword(req, res, next),
);

authRouter.post(
  '/admin/reset-password',
  validate(resetPasswordSchema),
  (req, res, next) => authController.resetPassword(req, res, next),
);

authRouter.get(
  '/me',
  authenticate,
  (req, res, next) => authController.me(req, res, next),
);

authRouter.get(
  '/admin/me',
  authenticate,
  requireAdmin,
  (req, res, next) => authController.me(req, res, next),
);

authRouter.get(
  '/admin/login-logs',
  authenticate,
  requireAdmin,
  (req, res, next) => authController.loginLogs(req, res, next),
);

module.exports = { authRouter };
