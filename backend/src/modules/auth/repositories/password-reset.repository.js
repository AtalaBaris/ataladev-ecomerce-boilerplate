const { prisma } = require('../../../config/database');
const { hashToken } = require('../../../utils/token');

class PasswordResetRepository {
  /**
   * @param {string} userId
   * @param {string} rawToken
   * @param {Date} expiresAt
   */
  async create(userId, rawToken, expiresAt) {
    await prisma.passwordResetToken.deleteMany({ where: { userId } });

    return prisma.passwordResetToken.create({
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
    return prisma.passwordResetToken.findFirst({
      where: {
        tokenHash: hashToken(rawToken),
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
      include: { user: true },
    });
  }

  /**
   * @param {string} id
   */
  async markUsed(id) {
    return prisma.passwordResetToken.update({
      where: { id },
      data: { usedAt: new Date() },
    });
  }
}

module.exports = { PasswordResetRepository };
