const service = require('../services/booking.service');

async function listBookings(req, res, next) {
  try {
    const items = await service.listBookings();
    res.json(items);
  } catch (err) {
    next(err);
  }
}

async function createBooking(req, res, next) {
  try {
    const item = await service.createBooking(req.body);
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listBookings,
  createBooking
};
