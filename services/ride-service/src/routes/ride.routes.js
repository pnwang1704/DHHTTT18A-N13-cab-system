const express = require('express');
const controller = require('../controllers/ride.controller');

const router = express.Router();

router.get('/', controller.listRides);
router.post('/', controller.createRide);

module.exports = router;
