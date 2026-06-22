const { z } = require('zod');

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email({ message: 'Geçerli bir e-posta adresi giriniz.' }),
  password: z.string().min(1, { message: 'Şifre zorunludur.' }),
});

module.exports = { loginSchema };
