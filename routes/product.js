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
  productControllers.createProduct
);
router.get('/:slug', productControllers.getProductsByCategorySlug);
router.get('/detail/:slug', productControllers.getProductBySlug);
router.put(
  '/photos/:slug',
  validateToken,
  validateAdmin,
  productControllers.uploadMorePhotos
);

router.put(
  '/photos/update/:slug',
  validateToken,
  validateAdmin,
  productControllers.updatePhoto
);

router.put(
  '/photos/delete/:slug',
  validateToken,
  validateAdmin,
  productControllers.deletePhoto
);

router.put(
  '/:slug',
  validateToken,
  validateAdmin,
  productControllers.updateProduct
);

module.exports = router;
