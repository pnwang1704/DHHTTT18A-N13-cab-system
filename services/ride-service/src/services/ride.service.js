const repo = require('../repositories/ride.repo');

async function listRides() {
  // TODO: implement Ride listing logic using repo
  return repo.findAll();
}

async function createRide(data) {
  // TODO: implement Ride creation logic using repo
  return repo.create(data);
}

module.exports = {
  listRides,
  createRide
};
