/**
 * @typedef {Object} UserProps
 * @property {string} id
 * @property {string} email
 * @property {string} passwordHash
 * @property {string} name
 * @property {string} role
 * @property {Date} createdAt
 */

class User {
  /**
   * @param {UserProps} props
   */
  constructor(props) {
    this.id = props.id;
    this.email = props.email;
    this.passwordHash = props.passwordHash;
    this.name = props.name;
    this.role = props.role;
    this.createdAt = props.createdAt;
  }

  /**
   * @returns {Omit<UserProps, 'passwordHash'>}
   */
  toPublic() {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      role: this.role,
      createdAt: this.createdAt,
    };
  }
}

module.exports = { User };
