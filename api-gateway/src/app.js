const express = require('express');
const loggingMiddleware = require('./middlewares/logging');
const routes = require('./routes');

const app = express();

app.use(express.json());
app.use(loggingMiddleware);

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
  res.status(500).json({ message: 'Internal Server Error' });
});

module.exports = app;
