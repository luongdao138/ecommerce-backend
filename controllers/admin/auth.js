const { registerValidator, loginValidator } = require('../../utils/validators');
const User = require('../../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports = {
  register: async (req, res) => {
    const { errors, isValid } = registerValidator(req.body);
    if (!isValid)
      return res.status(400).json({
        success: false,
        error: errors[Object.keys(errors)[0]],
      });
    const { email, username, firstName, lastName, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({
        success: false,
        error: 'Email already exists!',
      });

    const hashPw = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      username,
      firstName,
      lastName,
      password: hashPw,
      role: 'admin',
    });

    try {
      const savedUser = await newUser.save();
      return res.json({ sucess: true, user: savedUser });
    } catch (error) {
      return res.json({
        success: false,
        error,
      });
    }
  },
  login: async (req, res) => {
    console.log('Admin login');
    const { errors, isValid } = loginValidator(req.body);
    if (!isValid)
      return res.status(400).json({
        success: false,
        error: errors[Object.keys(errors)[0]],
      });
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (!existingUser)
      return res.status(400).json({
        success: false,
        error: 'Email does not exist!',
      });

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordValid)
      return res.status(400).json({
        success: false,
        error: 'Password is not correct!',
      });

    if (existingUser.role !== 'admin')
      return res.status(400).json({
        success: false,
        error: 'You are not admin!',
      });

    const token = jwt.sign(
      { id: existingUser._id },
      process.env.JWT_ACCESS_TOKEN,
      { expiresIn: '1h' }
    );
    const { _id, firstName, lastName, username, role } = existingUser;

    return res.json({
      success: true,
      token,
      user: { id: _id, firstName, lastName, email, username, role },
    });
  },
  getUser: async (req, res) => {
    const { token } = req.body;
    if (!token)
      return res.status(400).json({
        success: false,
        error: 'Token must be provided!',
      });

    try {
      const decodedToken = await jwt.verify(
        token,
        process.env.JWT_ACCESS_TOKEN
      );
      const user = await User.findById(decodedToken.id, { password: 0 });
      if (user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'You are not admin!',
        });
      }
      return res.json({
        success: true,
        token,
        user,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: 'Invalid/Expired token',
      });
    }
  },
};
