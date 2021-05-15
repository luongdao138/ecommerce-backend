const express = require('express');
const router = express.Router();
const validateAdmin = require('../../middlewares/validateAdmin');
const validateToken = require('../../middlewares/validateToken');
const pageControllers = require('../../controllers/admin/page');
const upload = require('../../middlewares/upload');

router.post(
  '/',
  validateToken,
  validateAdmin,
  upload('page_banners').fields([{ name: 'banners' }, { name: 'products' }]),
  pageControllers.createPage
);

router.get('/:category/:type', pageControllers.getPage);

module.exports = router;
