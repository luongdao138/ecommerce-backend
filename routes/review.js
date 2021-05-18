const express = require('express');
const router = express.Router();
const validateToken = require('../middlewares/validateToken');
const reviewController = require('../controllers/review');

router.get('/:slug', reviewController.getReviews);
router.post('/', validateToken, reviewController.createReview);
router.post('/likeReview', validateToken, reviewController.likeReview);

module.exports = router;
