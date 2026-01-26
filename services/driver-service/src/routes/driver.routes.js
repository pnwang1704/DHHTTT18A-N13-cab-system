const express = require('express');
const controller = require('../controllers/driver.controller');

const router = express.Router();

router.get('/', controller.listDrivers);
router.post('/', controller.createDriver);

module.exports = router;
