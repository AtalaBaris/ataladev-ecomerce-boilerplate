const { HttpStatus } = require('../errors/http-status');

/**
 * @param {import('zod').ZodSchema} schema
 * @param {'body' | 'query' | 'params'} source
 */
function validate(schema, source = 'body') {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Geçersiz istek verisi.',
          details: result.error.issues,
        },
      });
    }

    req.validated = result.data;
    return next();
  };
}

module.exports = { validate };
