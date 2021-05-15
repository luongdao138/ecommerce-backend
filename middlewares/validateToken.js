const jwt = require('jsonwebtoken');
const User = require('../models/user');

const validateToken = async (req, res, next) => {
  const authorization = req.header('Authorization');
  if (!authorization)
    return res.status(401).json({
      success: false,
      error: 'Token must be provided!',
    });

  if (!authorization.startsWith('Bearer '))
    return res.status(401).json({
      success: false,
      error: 'Token must be "Bearer [token]"',
    });

  const token = authorization.replace('Bearer ', '');
  try {
    const { id } = await jwt.verify(token, process.env.JWT_ACCESS_TOKEN);
    const user = await User.findById(id);
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: 'Invalid/Expired token',
    });
  }
};

module.exports = validateToken;
