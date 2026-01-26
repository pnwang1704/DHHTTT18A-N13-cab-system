const repo = require('../repositories/payment.repo');

async function listPayments() {
  // TODO: implement Payment listing logic using repo
  return repo.findAll();
}

async function createPayment(data) {
  // TODO: implement Payment creation logic using repo
  return repo.create(data);
}

module.exports = {
  listPayments,
  createPayment
};
