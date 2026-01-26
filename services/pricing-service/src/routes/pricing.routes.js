const express = require('express');
const controller = require('../controllers/pricing.controller');

const router = express.Router();

router.get('/', controller.listPricings);
router.post('/', controller.createPricing);

module.exports = router;
