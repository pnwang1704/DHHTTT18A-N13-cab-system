const repo = require('../repositories/booking.repo');

async function listBookings() {
  // TODO: implement Booking listing logic using repo
  return repo.findAll();
}

async function createBooking(data) {
  // TODO: implement Booking creation logic using repo
  return repo.create(data);
}

module.exports = {
  listBookings,
  createBooking
};
