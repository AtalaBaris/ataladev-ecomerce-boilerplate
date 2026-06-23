const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { AppError } = require('../../../core/errors/AppError');
const { HttpStatus } = require('../../../core/errors/http-status');
const { env } = require('../../../config/env');
const { sendEmail } = require('../../../core/services/email.service');
const { generateSecureToken } = require('../../../utils/token');
const { ROLES, ADMIN_ROLES } = require('../constants/roles');
const { UserRepository } = require('../repositories/user.repository');
const { RefreshTokenRepository } = require('../repositories/refresh-token.repository');
const { PasswordResetRepository } = require('../repositories/password-reset.repository');
const { LoginLogRepository } = require('../repositories/login-log.repository');

const SALT_ROUNDS = 12;

class AuthService {
  constructor(
    userRepository = new UserRepository(),
    refreshTokenRepository = new RefreshTokenRepository(),
    passwordResetRepository = new PasswordResetRepository(),
    loginLogRepository = new LoginLogRepository(),
  ) {
    this.userRepository = userRepository;
    this.refreshTokenRepository = refreshTokenRepository;
    this.passwordResetRepository = passwordResetRepository;
    this.loginLogRepository = loginLogRepository;
  }

  async register(dto) {
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new AppError(
        'Bu e-posta adresi zaten kayıtlı.',
        HttpStatus.CONFLICT,
        'EMAIL_ALREADY_EXISTS',
      );
    }

    const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);

    const user = await this.userRepository.create({
      email: dto.email,
      passwordHash,
      name: `${dto.firstName} ${dto.lastName}`.trim(),
      role: ROLES.USER,
    });

    return this._issueTokenPair(user);
  }

  /** Müşteri vitrini için (ileride) — USER rolü */
  async login(dto, meta = {}) {
    return this._loginWithRoleCheck(dto, null, meta);
  }

  /** Admin paneli — yalnızca ADMIN rolü */
  async adminLogin(dto, meta = {}) {
    return this._loginWithRoleCheck(dto, ADMIN_ROLES, meta);
  }

  async _loginWithRoleCheck(dto, allowedRoles, meta) {
    const user = await this.userRepository.findByEmail(dto.email);

    if (!user) {
      await this._logAttempt(dto.email, false, meta);
      throw new AppError(
        'E-posta veya şifre hatalı.',
        HttpStatus.UNAUTHORIZED,
        'INVALID_CREDENTIALS',
      );
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);

    if (!isPasswordValid) {
      await this._logAttempt(dto.email, false, { ...meta, userId: user.id });
      throw new AppError(
        'E-posta veya şifre hatalı.',
        HttpStatus.UNAUTHORIZED,
        'INVALID_CREDENTIALS',
      );
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      await this._logAttempt(dto.email, false, { ...meta, userId: user.id });
      throw new AppError(
        'Bu hesapla yönetim paneline erişim yetkiniz yok.',
        HttpStatus.FORBIDDEN,
        'FORBIDDEN',
      );
    }

    await this._logAttempt(dto.email, true, { ...meta, userId: user.id });
    await this.loginLogRepository.cleanupExpired();

    return this._issueTokenPair(user);
  }

  async refresh(rawRefreshToken) {
    const stored = await this.refreshTokenRepository.findValid(rawRefreshToken);

    if (!stored?.user) {
      throw new AppError(
        'Geçersiz veya süresi dolmuş oturum.',
        HttpStatus.UNAUTHORIZED,
        'INVALID_REFRESH_TOKEN',
      );
    }

    await this.refreshTokenRepository.deleteByToken(rawRefreshToken);

    const user = await this.userRepository.findById(stored.user.id);
    if (!user) {
      throw new AppError(
        'Kullanıcı bulunamadı.',
        HttpStatus.UNAUTHORIZED,
        'USER_NOT_FOUND',
      );
    }

    return this._issueTokenPair(user);
  }

  async logout(rawRefreshToken) {
    if (rawRefreshToken) {
      await this.refreshTokenRepository.deleteByToken(rawRefreshToken);
    }
    return { success: true };
  }

  async getProfile(userId) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new AppError(
        'Kullanıcı bulunamadı.',
        HttpStatus.NOT_FOUND,
        'USER_NOT_FOUND',
      );
    }
    return user.toPublic();
  }

  async getLoginLogs(limit = 50) {
    return this.loginLogRepository.findRecent(limit);
  }

  async clearLoginLogs() {
    const deletedCount = await this.loginLogRepository.deleteAll();
    return { deletedCount };
  }

  async forgotPassword(email) {
    const user = await this.userRepository.findByEmail(email);

    if (!user || !ADMIN_ROLES.includes(user.role)) {
      if (env.nodeEnv !== 'production') {
        console.warn(
          '[Auth] Şifre sıfırlama isteği işlenmedi — e-posta kayıtlı admin değil.',
        );
        console.warn(
          `[Auth] Geliştirme ipucu: seed admin e-postası "${env.admin.email}" kullanın.`,
        );
      }
      return {
        message:
          'E-posta kayıtlıysa şifre sıfırlama bağlantısı gönderildi.',
      };
    }

    const rawToken = generateSecureToken();
    const expiresAt = new Date();
    expiresAt.setMinutes(
      expiresAt.getMinutes() + env.auth.passwordResetExpiresMinutes,
    );

    await this.passwordResetRepository.create(user.id, rawToken, expiresAt);

    const resetUrl = `${env.appUrl}/admin/reset-password?token=${rawToken}`;

    await sendEmail({
      to: user.email,
      subject: 'Atala Admin — Şifre Sıfırlama',
      text: `Şifrenizi sıfırlamak için bu bağlantıyı kullanın (60 dk geçerli):\n\n${resetUrl}`,
      html: `<p>Şifrenizi sıfırlamak için <a href="${resetUrl}">buraya tıklayın</a>.</p><p>Bağlantı ${env.auth.passwordResetExpiresMinutes} dakika geçerlidir.</p>`,
    });

    if (env.nodeEnv !== 'production') {
      console.log('\n========================================');
      console.log('  ŞİFRE SIFIRLAMA LİNKİ (backend terminal)');
      console.log(`  ${resetUrl}`);
      console.log('========================================\n');
    }

    return {
      message:
        'E-posta kayıtlıysa şifre sıfırlama bağlantısı gönderildi.',
    };
  }

  async resetPassword(rawToken, newPassword) {
    const stored = await this.passwordResetRepository.findValid(rawToken);

    if (!stored?.user) {
      throw new AppError(
        'Geçersiz veya süresi dolmuş sıfırlama bağlantısı.',
        HttpStatus.BAD_REQUEST,
        'INVALID_RESET_TOKEN',
      );
    }

    const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);

    await this.userRepository.updatePassword(stored.user.id, passwordHash);
    await this.passwordResetRepository.markUsed(stored.id);
    await this.refreshTokenRepository.deleteAllForUser(stored.user.id);

    return {
      message: 'Şifreniz güncellendi. Yeni şifrenizle giriş yapabilirsiniz.',
    };
  }

  async _issueTokenPair(user) {
    const accessToken = this._generateAccessToken(user);
    const refreshToken = generateSecureToken(48);
    const refreshExpires = new Date();

    const refreshDays = parseRefreshDays(env.jwt.refreshExpiresIn);
    refreshExpires.setDate(refreshExpires.getDate() + refreshDays);

    await this.refreshTokenRepository.create(
      user.id,
      refreshToken,
      refreshExpires,
    );

    return {
      user: user.toPublic(),
      accessToken,
      refreshToken,
      expiresIn: env.jwt.accessExpiresIn,
    };
  }

  _generateAccessToken(user) {
    return jwt.sign(
      {
        sub: user.id,
        email: user.email,
        role: user.role,
      },
      env.jwt.secret,
      { expiresIn: env.jwt.accessExpiresIn },
    );
  }

  async _logAttempt(email, success, meta = {}) {
    try {
      await this.loginLogRepository.create({
        email,
        success,
        userId: meta.userId || null,
        ip: meta.ip || null,
        userAgent: meta.userAgent || null,
      });
    } catch (error) {
      console.error('[AuthService] Login log yazılamadı:', error.message);
    }
  }
}

function parseRefreshDays(expiresIn) {
  if (expiresIn.endsWith('d')) return Number(expiresIn.replace('d', '')) || 7;
  if (expiresIn.endsWith('h')) return Math.ceil(Number(expiresIn.replace('h', '')) / 24) || 1;
  return 7;
}

module.exports = { AuthService };
