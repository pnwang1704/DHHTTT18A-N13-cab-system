const express = require('express');
const loggingMiddleware = require('./middlewares/logging');
const routes = require('./routes');
const cors = require('cors');

const app = express();

app.use(express.json());
app.use(loggingMiddleware);

// CORS – cho FE gọi đến gateway
app.use(
  cors({
    origin: '*', // sau này có thể giới hạn domain FE
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization'
  })
);

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
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    statusCode,
    message,
    path: req.originalUrl,
    timestamp: new Date().toISOString()
  });
});

module.exports = app;
