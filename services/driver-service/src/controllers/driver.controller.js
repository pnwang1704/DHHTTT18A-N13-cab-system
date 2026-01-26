const service = require('../services/driver.service');

async function listDrivers(req, res, next) {
  try {
    const items = await service.listDrivers();
    res.json(items);
  } catch (err) {
    next(err);
  }
}

async function createDriver(req, res, next) {
  try {
    const item = await service.createDriver(req.body);
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listDrivers,
  createDriver
};
