const express = require('express');
const controller = require('../controllers/notification.controller');

const router = express.Router();

router.get('/', controller.listNotifications);
router.post('/', controller.createNotification);

module.exports = router;
