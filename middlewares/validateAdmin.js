const validateAdmin = (req, res, next) => {
  const { user } = req;
  if (user.role !== 'admin')
    return res.status(403).json({
      success: false,
      error: 'Action not allowed!',
    });

  next();
};

module.exports = validateAdmin;
