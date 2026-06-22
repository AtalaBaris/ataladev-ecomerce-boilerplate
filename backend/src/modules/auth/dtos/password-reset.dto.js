const { z } = require('zod');

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email({ message: 'Geçerli bir e-posta adresi giriniz.' }),
});

const resetPasswordSchema = z.object({
  token: z.string().min(1, { message: 'Sıfırlama token\'ı gerekli.' }),
  password: z
    .string()
    .min(8, { message: 'Şifre en az 8 karakter olmalıdır.' }),
});

const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, { message: 'Refresh token gerekli.' }),
});

const logoutSchema = z.object({
  refreshToken: z.string().optional(),
});

module.exports = {
  forgotPasswordSchema,
  resetPasswordSchema,
  refreshTokenSchema,
  logoutSchema,
};
