const express = require('express');
const controller = require('../controllers/booking.controller');

const router = express.Router();

router.get('/', controller.listBookings);
router.post('/', controller.createBooking);

module.exports = router;
