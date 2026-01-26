const express = require('express');
const morgan = require('morgan');
const rideRoutes = require('./routes/ride.routes');
const errorHandler = require('./middlewares/error.middleware');

const app = express();

app.use(express.json());
app.use(morgan('dev'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'ride-service' });
});

// API routes
app.use('/rides', rideRoutes);

// 404
app.use((req, res, next) => {
  res.status(404).json({ message: 'Not Found' });
});

// Error handler
app.use(errorHandler);

module.exports = app;
