const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  firstName: {
    type: String,
    trim: true,
    minLength: 3,
    maxLength: 20,
    required: true,
  },
  lastName: {
    type: String,
    trim: true,
    minLength: 3,
    required: true,
    maxLength: 20,
  },
  username: {
    required: true,
    type: String,
    trim: true,
    unique: true,
    index: true,
    lowercase: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
  },
  password: {
    required: true,
    type: String,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  contactNumber: String,
  avatar: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = model('User', userSchema);

module.exports = User;
