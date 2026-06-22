const { Router } = require('express');
const { validate } = require('../../core/middleware/validate.middleware');
const { registerSchema } = require('./dtos/register.dto');
const { loginSchema } = require('./dtos/login.dto');
const { authenticate } = require('./middleware/auth.middleware');
const { AuthController } = require('./controllers/auth.controller');

const authRouter = Router();
const authController = new AuthController();

authRouter.post(
  '/register',
  validate(registerSchema),
  (req, res, next) => authController.register(req, res, next),
);

authRouter.post(
  '/login',
  validate(loginSchema),
  (req, res, next) => authController.login(req, res, next),
);

authRouter.get(
  '/me',
  authenticate,
  (req, res, next) => authController.me(req, res, next),
);

module.exports = { authRouter };
