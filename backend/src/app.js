const express = require('express');
const cors = require('cors');
const { env } = require('./config/env');
const { authRouter } = require('./modules/auth/auth.routes');
const { errorHandler } = require('./core/middleware/error-handler');

const app = express();

app.set('trust proxy', 1);
app.use(cors());
app.use(express.json());

if (env.nodeEnv !== 'production') {
  app.use((req, res, next) => {
    const started = Date.now();
    res.on('finish', () => {
      console.log(
        `[HTTP] ${req.method} ${req.originalUrl} → ${res.statusCode} (${Date.now() - started}ms)`,
      );
    });
    next();
  });
}

app.get('/health', (_req, res) => {
  res.json({ success: true, message: 'Atala E-Commerce API is running.' });
});

app.use('/api/auth', authRouter);

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'İstenen kaynak bulunamadı.',
    },
  });
});

app.use(errorHandler);

module.exports = { app };
