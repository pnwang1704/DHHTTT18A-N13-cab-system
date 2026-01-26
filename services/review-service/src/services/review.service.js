const repo = require('../repositories/review.repo');

async function listReviews() {
  // TODO: implement Review listing logic using repo
  return repo.findAll();
}

async function createReview(data) {
  // TODO: implement Review creation logic using repo
  return repo.create(data);
}

module.exports = {
  listReviews,
  createReview
};
