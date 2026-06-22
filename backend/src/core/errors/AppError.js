class AppError extends Error {
  /**
   * @param {string} message
   * @param {number} statusCode
   * @param {string} [code]
   */
  constructor(message, statusCode, code = 'APP_ERROR') {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
  }
}

module.exports = { AppError };
