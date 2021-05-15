const { Schema, model } = require('mongoose');

const bannerSchema = new Schema({
  image: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    default: true,
  },
  navigateTo: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Banner = model('Banner', bannerSchema);
module.exports = Banner;
