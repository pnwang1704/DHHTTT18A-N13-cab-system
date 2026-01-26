const express = require('express');
const controller = require('../controllers/review.controller');

const router = express.Router();

router.get('/', controller.listReviews);
router.post('/', controller.createReview);

module.exports = router;
