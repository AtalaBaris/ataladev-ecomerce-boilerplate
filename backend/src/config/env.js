require('dotenv').config();

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 3000,
  appUrl: process.env.APP_URL || 'http://localhost:3001',
  jwt: {
    secret: process.env.JWT_SECRET || 'atala-dev-secret-change-in-production',
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '24h',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },
  auth: {
    enablePublicRegister: process.env.ENABLE_PUBLIC_REGISTER === 'true',
    loginLogRetentionDays: Number(process.env.LOGIN_LOG_RETENTION_DAYS) || 30,
    passwordResetExpiresMinutes: Number(process.env.PASSWORD_RESET_EXPIRES_MINUTES) || 60,
  },
  admin: {
    email: process.env.ADMIN_EMAIL || 'admin@atala.com',
    password: process.env.ADMIN_PASSWORD || 'ChangeMe_Admin123!',
    name: process.env.ADMIN_NAME || 'Atala Admin',
  },
  smtp: {
    host: process.env.SMTP_HOST || '',
    port: Number(process.env.SMTP_PORT) || 587,
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
    from: process.env.SMTP_FROM || 'noreply@atala.com',
  },
};

module.exports = { env };
