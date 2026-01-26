const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { services } = require('../config/services');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

// Helper tạo proxy
const createServiceProxy = (target) =>
  createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite: (path, req) => path // có thể custom thêm nếu cần
  });

// Auth routes (không yêu cầu token)
router.use('/auth', createServiceProxy(services.auth));

// User routes (yêu cầu token)
router.use('/users', authMiddleware(true), createServiceProxy(services.user));

// Driver routes
router.use('/drivers', authMiddleware(true), createServiceProxy(services.driver));

// Booking routes
router.use('/bookings', authMiddleware(true), createServiceProxy(services.booking));

// Ride routes
router.use('/rides', authMiddleware(true), createServiceProxy(services.ride));

// Pricing (có thể public để estimate giá)
router.use('/pricing', authMiddleware(false), createServiceProxy(services.pricing));

// Payment
router.use('/payments', authMiddleware(true), createServiceProxy(services.payment));

// Notification
router.use('/notifications', authMiddleware(true), createServiceProxy(services.notification));

// Review
router.use('/reviews', authMiddleware(true), createServiceProxy(services.review));

module.exports = router;
