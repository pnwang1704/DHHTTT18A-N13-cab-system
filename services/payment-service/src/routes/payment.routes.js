const express = require('express');
const controller = require('../controllers/payment.controller');

const router = express.Router();

router.get('/', controller.listPayments);
router.post('/', controller.createPayment);

module.exports = router;
