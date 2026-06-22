const { prisma } = require('../../../config/database');
const { hashToken } = require('../../../utils/token');

class RefreshTokenRepository {
  /**
   * @param {string} userId
   * @param {string} rawToken
   * @param {Date} expiresAt
   */
  async create(userId, rawToken, expiresAt) {
    return prisma.refreshToken.create({
      data: {
        userId,
        tokenHash: hashToken(rawToken),
        expiresAt,
      },
    });
  }

  /**
   * @param {string} rawToken
   */
  async findValid(rawToken) {
    return prisma.refreshToken.findFirst({
      where: {
        tokenHash: hashToken(rawToken),
        expiresAt: { gt: new Date() },
      },
      include: { user: true },
    });
  }

  /**
   * @param {string} rawToken
   */
  async deleteByToken(rawToken) {
    return prisma.refreshToken.deleteMany({
      where: { tokenHash: hashToken(rawToken) },
    });
  }

  /**
   * @param {string} userId
   */
  async deleteAllForUser(userId) {
    return prisma.refreshToken.deleteMany({ where: { userId } });
  }
}

module.exports = { RefreshTokenRepository };
