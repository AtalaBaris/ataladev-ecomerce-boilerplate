require('dotenv').config();

const { prisma } = require('../src/config/database');

const limit = Number(process.argv[2]) || 20;

async function main() {
  const logs = await prisma.loginLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: {
      user: { select: { email: true, name: true } },
    },
  });

  if (logs.length === 0) {
    console.log('Henüz login logu yok.');
    return;
  }

  console.table(
    logs.map((log) => ({
      tarih: log.createdAt.toISOString().replace('T', ' ').slice(0, 19),
      email: log.email,
      basarili: log.success ? '✓' : '✗',
      ip: log.ip || '-',
      userAgent: log.userAgent ? log.userAgent.slice(0, 40) + '…' : '-',
    })),
  );
}

main()
  .catch((error) => {
    console.error('Log okunamadı:', error.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
