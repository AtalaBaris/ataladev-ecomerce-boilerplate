require('dotenv').config();

const { app } = require('./app');
const { env } = require('./config/env');
const { prisma, pool } = require('./config/database');

async function startServer() {
  try {
    await prisma.$connect();
    console.log('[Database] PostgreSQL bağlantısı başarılı.');

    const server = app.listen(env.port, () => {
      console.log(`[Server] Atala API ${env.port} portunda çalışıyor (${env.nodeEnv})`);
    });

    const shutdown = async (signal) => {
      console.log(`[Server] ${signal} alındı, kapatılıyor...`);
      server.close(async () => {
        await prisma.$disconnect();
        await pool.end();
        process.exit(0);
      });
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  } catch (error) {
    console.error('[Database] Bağlantı hatası:', error.message);
    process.exit(1);
  }
}

startServer();
