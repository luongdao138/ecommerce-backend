const Product = require('../models/product');
const Rating = require('../models/rating');
const { convertRatings, countAverageRating } = require('../utils/rating');

module.exports = {
  rateProduct: async (req, res) => {
    const { productId, star } = req.body;
    try {
      const product = await Product.findById(productId);
      if (!product)
        return res.status(400).json({
          success: false,
          error: 'Product not found!',
        });

      const rating = await Rating.findOne({ userId: req.user._id, productId });
      if (rating) {
        rating.star = star;
        await rating.save();
        return res.json({
          success: true,
          message: 'Rating product successfully!',
        });
      }

      const newRating = new Rating({
        productId,
        star: Number(star),
        userId: req.user._id,
      });

      await newRating.save();
      return res.json({
        success: true,
        message: 'Rating product successfully!',
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: 'There is something wrong!',
      });
    }
  },
  getRatingsOfOneProduct: async (req, res) => {
    const { slug } = req.params;

    try {
      const product = await Product.findOne({ slug });
      if (!product)
        return res.status(400).json({
          success: false,
          error: 'Product not found!',
        });
      const ratings = await Rating.find(
        { productId: product._id },
        { star: 1 }
      );
      return res.json({
        success: true,
        ratings: {
          details: convertRatings(ratings),
          total: ratings.length,
          average: countAverageRating(ratings),
        },
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        success: false,
        error: 'There is something wrong!',
      });
    }
  },
};
