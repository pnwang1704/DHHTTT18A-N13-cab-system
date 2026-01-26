const service = require('../services/pricing.service');

async function listPricings(req, res, next) {
  try {
    const items = await service.listPricings();
    res.json(items);
  } catch (err) {
    next(err);
  }
}

async function createPricing(req, res, next) {
  try {
    const item = await service.createPricing(req.body);
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listPricings,
  createPricing
};
