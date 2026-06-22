const express = require('express');
const cors = require('cors');
const { authRouter } = require('./modules/auth/auth.routes');
const { errorHandler } = require('./core/middleware/error-handler');

const app = express();

app.use(cors());
app.use(express.json());

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
