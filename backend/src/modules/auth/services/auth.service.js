const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { AppError } = require('../../../core/errors/AppError');
const { HttpStatus } = require('../../../core/errors/http-status');
const { env } = require('../../../config/env');
const { UserRepository } = require('../repositories/user.repository');

const SALT_ROUNDS = 12;

class AuthService {
  constructor(userRepository = new UserRepository()) {
    this.userRepository = userRepository;
  }

  /**
   * @param {import('../dtos/register.dto').registerSchema extends import('zod').ZodType<infer T> ? T : never} dto
   */
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
    });

    const token = this._generateToken(user);

    return {
      user: user.toPublic(),
      token,
    };
  }

  /**
   * @param {import('../dtos/login.dto').loginSchema extends import('zod').ZodType<infer T> ? T : never} dto
   */
  async login(dto) {
    const user = await this.userRepository.findByEmail(dto.email);
    if (!user) {
      throw new AppError(
        'E-posta veya şifre hatalı.',
        HttpStatus.UNAUTHORIZED,
        'INVALID_CREDENTIALS',
      );
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new AppError(
        'E-posta veya şifre hatalı.',
        HttpStatus.UNAUTHORIZED,
        'INVALID_CREDENTIALS',
      );
    }

    const token = this._generateToken(user);

    return {
      user: user.toPublic(),
      token,
    };
  }

  /**
   * @param {string} userId
   */
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

  /**
   * @param {import('../entities/user.entity').User} user
   */
  _generateToken(user) {
    return jwt.sign(
      {
        sub: user.id,
        email: user.email,
        role: user.role,
      },
      env.jwt.secret,
      { expiresIn: env.jwt.expiresIn },
    );
  }
}

module.exports = { AuthService };
