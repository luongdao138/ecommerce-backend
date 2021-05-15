const express = require('express');
const router = express.Router();

const adminAuthRouter = require('../../controllers/admin/auth');

router.post('/login', adminAuthRouter.login);
router.post('/register', adminAuthRouter.register);
router.post('/getuser', adminAuthRouter.getUser);

module.exports = router;
