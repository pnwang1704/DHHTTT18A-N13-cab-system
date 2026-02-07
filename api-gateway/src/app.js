const express = require('express');
const cors = require('cors');
const loggingMiddleware = require('./middlewares/logging');
const routes = require('./routes');
const { globalLimiter } = require('./middlewares/rateLimit');

const app = express();

app.use(express.json());
app.use(loggingMiddleware);

app.use(
  cors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization'
  })
);

// ✅ Rate limit toàn hệ thống
app.use(globalLimiter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'api-gateway' });
});

// Mount API routes
app.use('/', routes);

// 404
app.use((req, res, next) => {
  res.status(404).json({ message: 'Not Found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('[API-GATEWAY] Error:', err);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({ message: err.message || 'Internal Server Error' });
});

module.exports = app;
