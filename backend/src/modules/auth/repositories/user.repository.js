const { prisma } = require('../../../config/database');
const { User } = require('../entities/user.entity');

class UserRepository {
  /**
   * @param {import('@prisma/client').User | null} record
   * @returns {User | null}
   */
  _toEntity(record) {
    if (!record) return null;

    return new User({
      id: record.id,
      email: record.email,
      passwordHash: record.passwordHash,
      name: record.name,
      role: record.role,
      createdAt: record.createdAt,
    });
  }

  /**
   * @param {Object} data
   * @param {string} data.email
   * @param {string} data.passwordHash
   * @param {string} data.name
   * @param {string} [data.role]
   * @returns {Promise<User>}
   */
  async create(data) {
    const record = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash: data.passwordHash,
        name: data.name,
        role: data.role || 'USER',
      },
    });

    return this._toEntity(record);
  }

  /**
   * @param {string} email
   * @returns {Promise<User | null>}
   */
  async findByEmail(email) {
    const record = await prisma.user.findUnique({
      where: { email },
    });

    return this._toEntity(record);
  }

  /**
   * @param {string} id
   * @returns {Promise<User | null>}
   */
  async findById(id) {
    const record = await prisma.user.findUnique({
      where: { id },
    });

    return this._toEntity(record);
  }
}

module.exports = { UserRepository };
