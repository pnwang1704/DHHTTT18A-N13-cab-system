const service = require('../services/ride.service');

async function listRides(req, res, next) {
  try {
    const items = await service.listRides();
    res.json(items);
  } catch (err) {
    next(err);
  }
}

async function createRide(req, res, next) {
  try {
    const item = await service.createRide(req.body);
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listRides,
  createRide
};
