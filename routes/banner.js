const express = require('express');
const router = express.Router();

const validateToken = require('../middlewares/validateToken');
const validateAdmin = require('../middlewares/validateAdmin');
const upload = require('../middlewares/upload');
const bannerController = require('../controllers/banner');

router.post(
  '/',
  validateToken,
  validateAdmin,
  upload('banners').single('image'),
  bannerController.createBanner
);
router.get('/', bannerController.getBanners);
router.put(
  '/:id',
  validateToken,
  validateAdmin,
  upload('banners').single('image'),
  bannerController.updateBanner
);
router.delete(
  '/:id',
  validateToken,
  validateAdmin,
  bannerController.deleteBanner
);

module.exports = router;
