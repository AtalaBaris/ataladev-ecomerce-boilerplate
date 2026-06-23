const { rateLimit } = require('express-rate-limit');
const { env } = require('../../config/env');
const { HttpStatus } = require('../errors/http-status');
const { getClientIp } = require('../../utils/request-meta');

const loginRateLimiter = rateLimit({
  windowMs: env.auth.loginRateLimitWindowMinutes * 60 * 1000,
  max: env.auth.loginRateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  keyGenerator: (req) => {
    const ip = getClientIp(req) || 'unknown';
    const email = req.validated?.email || 'unknown';
    return `${ip}:${email}`;
  },
  handler: (_req, res) => {
    res.status(HttpStatus.TOO_MANY_REQUESTS).json({
      success: false,
      error: {
        code: 'LOGIN_RATE_LIMIT',
        message: `Çok fazla başarısız giriş denemesi. ${env.auth.loginRateLimitWindowMinutes} dakika sonra tekrar deneyin.`,
      },
    });
  },
});

module.exports = { loginRateLimiter };
