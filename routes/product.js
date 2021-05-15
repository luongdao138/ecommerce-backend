const express = require('express');
const router = express.Router();

const productControllers = require('../controllers/product');
const validateToken = require('../middlewares/validateToken');
const validateAdmin = require('../middlewares/validateAdmin');
const uploadMiddleware = require('../middlewares/upload');

router.get('/', productControllers.getProducts);
router.post(
  '/',
  validateToken,
  validateAdmin,
  uploadMiddleware('products').array('image'),
  productControllers.createProduct
);
router.get('/:slug', productControllers.getProductsBySlug);

module.exports = router;
