const express = require('express');
const router = express.Router();

const categoryControllers = require('../controllers/category');
const validateToken = require('../middlewares/validateToken');
const validateAdmin = require('../middlewares/validateAdmin');
const uploadMiddleware = require('../middlewares/upload');

router.post(
  '/',
  validateToken,
  validateAdmin,
  uploadMiddleware('categories').single('image'),
  categoryControllers.createCategory
);
router.post(
  '/update',
  validateToken,
  validateAdmin,
  uploadMiddleware('categories').array('image'),
  categoryControllers.updateCategory
);
router.post(
  '/delete',
  validateToken,
  validateAdmin,
  categoryControllers.deleteCategories
);
router.get('/', categoryControllers.getCategories);

module.exports = router;
