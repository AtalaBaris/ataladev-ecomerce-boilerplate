require('dotenv').config();

const bcrypt = require('bcryptjs');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');
const { Pool } = require('pg');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const SALT_ROUNDS = 12;

async function main() {
  const email = process.env.ADMIN_EMAIL || 'admin@atala.com';
  const password = process.env.ADMIN_PASSWORD || 'ChangeMe_Admin123!';
  const name = process.env.ADMIN_NAME || 'Atala Admin';

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      passwordHash,
      name,
      role: 'ADMIN',
    },
    create: {
      email,
      passwordHash,
      name,
      role: 'ADMIN',
    },
  });

  console.log(`[Seed] Admin kullanıcı hazır: ${admin.email} (role: ${admin.role})`);
  console.log('[Seed] Giriş için ADMIN_EMAIL ve ADMIN_PASSWORD .env değerlerini kullanın.');
}

main()
  .catch((error) => {
    console.error('[Seed] Hata:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
