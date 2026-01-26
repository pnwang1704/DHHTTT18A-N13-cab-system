const service = require('../services/payment.service');

async function listPayments(req, res, next) {
  try {
    const items = await service.listPayments();
    res.json(items);
  } catch (err) {
    next(err);
  }
}

async function createPayment(req, res, next) {
  try {
    const item = await service.createPayment(req.body);
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listPayments,
  createPayment
};
