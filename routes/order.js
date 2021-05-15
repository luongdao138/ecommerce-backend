const express = require('express');
const router = express.Router();
const validateToken = require('../middlewares/validateToken');
const validateAdmin = require('../middlewares/validateAdmin');

const orderControllers = require('../controllers/order');

router.post('/', validateToken, orderControllers.createOrder);

module.exports = router;
