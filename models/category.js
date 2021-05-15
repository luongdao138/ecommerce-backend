const { Schema, model } = require('mongoose');

const categorySchema = new Schema({
  name: {
    type: String,
    trim: true,
    unique: true,
    required: true,
  },
  slug: {
    type: String,
    trim: true,
    unique: true,
    required: true,
  },
  description: {
    type: String,
  },
  image: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  parentId: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
  },
  type: {
    type: String,
  },
});

const Category = model('Category', categorySchema);
module.exports = Category;
