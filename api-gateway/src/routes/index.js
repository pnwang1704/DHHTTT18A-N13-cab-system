const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { services } = require('../config/services');
const authMiddleware = require('../middlewares/auth');
const { authLimiter } = require('../middlewares/rateLimit');

const router = express.Router();

const createServiceProxy = (target) =>
  createProxyMiddleware({
    target,
    changeOrigin: true,
    onProxyReq: (proxyReq, req, res) => {
      if (req.user) {
        proxyReq.setHeader('x-user-id', req.user.userId);
        proxyReq.setHeader('x-user-email', req.user.email);
        proxyReq.setHeader('x-user-role', req.user.role);
      }
    },
    onError: (err, req, res) => {
      console.error('[API-GATEWAY] Proxy error:', err.message);
      if (!res.headersSent) {
        res.status(502).json({ message: 'Bad Gateway: target service unavailable' });
      }
    }
  });

// ✅ Auth routes: rate limit chặt để chống brute force
router.use('/auth', authLimiter, createServiceProxy(services.auth));

// Các route khác
router.use('/users', authMiddleware(true), createServiceProxy(services.user));
router.use('/drivers', authMiddleware(true), createServiceProxy(services.driver));
router.use('/bookings', authMiddleware(true), createServiceProxy(services.booking));
router.use('/rides', authMiddleware(true), createServiceProxy(services.ride));
router.use('/pricing', authMiddleware(false), createServiceProxy(services.pricing));
router.use('/payments', authMiddleware(true), createServiceProxy(services.payment));
router.use('/notifications', authMiddleware(true), createServiceProxy(services.notification));
router.use('/reviews', authMiddleware(true), createServiceProxy(services.review));

module.exports = router;
