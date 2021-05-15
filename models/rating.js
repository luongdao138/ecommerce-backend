const { Schema, model } = require('mongoose');

const ratingSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  productId: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
  },
  star: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Rating = model('Rating', ratingSchema);
module.exports = Rating;
