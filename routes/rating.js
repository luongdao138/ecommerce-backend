const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/rating');
const validateToken = require('../middlewares/validateToken');

router.post('/', validateToken, ratingController.rateProduct);
router.get('/:slug', ratingController.getRatingsOfOneProduct);

module.exports = router;
