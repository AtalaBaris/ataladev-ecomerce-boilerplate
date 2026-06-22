/**
 * @param {import('express').Request} req
 */
function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim();
  }
  return req.ip || req.socket?.remoteAddress || null;
}

/**
 * @param {import('express').Request} req
 */
function getUserAgent(req) {
  const agent = req.headers['user-agent'];
  return typeof agent === 'string' ? agent : null;
}

module.exports = { getClientIp, getUserAgent };
