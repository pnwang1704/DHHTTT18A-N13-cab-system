const repo = require('../repositories/pricing.repo');

async function listPricings() {
  // TODO: implement Pricing listing logic using repo
  return repo.findAll();
}

async function createPricing(data) {
  // TODO: implement Pricing creation logic using repo
  return repo.create(data);
}

module.exports = {
  listPricings,
  createPricing
};
