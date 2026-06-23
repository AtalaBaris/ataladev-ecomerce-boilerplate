const { prisma } = require('../../../config/database');
const { env } = require('../../../config/env');

class LoginLogRepository {
  /**
   * @param {Object} data
   * @param {string} data.email
   * @param {boolean} data.success
   * @param {string} [data.userId]
   * @param {string} [data.ip]
   * @param {string} [data.userAgent]
   */
  async create(data) {
    return prisma.loginLog.create({ data });
  }

  /**
   * @param {number} [limit]
   */
  async findRecent(limit = 50) {
    return prisma.loginLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        user: {
          select: { id: true, email: true, name: true, role: true },
        },
      },
    });
  }

  async cleanupExpired() {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - env.auth.loginLogRetentionDays);

    const result = await prisma.loginLog.deleteMany({
      where: { createdAt: { lt: cutoff } },
    });

    return result.count;
  }

  async countRecentFailuresByEmail(email, windowMinutes) {
    const since = new Date();
    since.setMinutes(since.getMinutes() - windowMinutes);

    return prisma.loginLog.count({
      where: {
        email,
        success: false,
        createdAt: { gte: since },
      },
    });
  }

  async deleteAll() {
    const result = await prisma.loginLog.deleteMany();
    return result.count;
  }
}

module.exports = { LoginLogRepository };
