const { z } = require('zod');

const registerSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email({ message: 'Geçerli bir e-posta adresi giriniz.' }),
  password: z
    .string()
    .min(8, { message: 'Şifre en az 8 karakter olmalıdır.' }),
  firstName: z
    .string()
    .trim()
    .min(2, { message: 'Ad en az 2 karakter olmalıdır.' }),
  lastName: z
    .string()
    .trim()
    .min(2, { message: 'Soyad en az 2 karakter olmalıdır.' }),
});

module.exports = { registerSchema };
