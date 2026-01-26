const service = require('../services/review.service');

async function listReviews(req, res, next) {
  try {
    const items = await service.listReviews();
    res.json(items);
  } catch (err) {
    next(err);
  }
}

async function createReview(req, res, next) {
  try {
    const item = await service.createReview(req.body);
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listReviews,
  createReview
};
