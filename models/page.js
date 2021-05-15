const { Schema, model } = require('mongoose');

const pageSchema = new Schema({
  title: {
    type: String,
    require: true,
    trim: true,
  },
  description: {
    type: String,
    require: true,
    trim: true,
  },
  banners: [
    {
      image: String,
      navigateTo: String,
    },
  ],
  products: [
    {
      image: String,
      navigateTo: String,
    },
  ],
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Page = model('Page', pageSchema);
module.exports = Page;
