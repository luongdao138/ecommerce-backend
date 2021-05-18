const Product = require('../models/product');
const Review = require('../models/review');

module.exports = {
  createReview: async (req, res) => {
    const { productId, title, content } = req.body;

    const newReview = new Review({
      productId,
      title,
      content,
      userId: req.user._id,
    });
    try {
      const savedReview = await newReview.save();
      // console.log({ ...savedReview });
      return res.json({
        success: true,
        review: {
          ...savedReview._doc,
          userId: {
            username: req.user.username,
            id: req.user._id,
            avatar: req.user.avatar,
          },
        },
      });
    } catch (error) {
      console.log(review);
      return res.status(400).json({
        success: false,
        error: 'Can not create the review!',
      });
    }
  },
  getReviews: async (req, res) => {
    const { slug } = req.params;
    const limit = Number(req.query.limit) || 100;
    const skip = req.query.skip ? Number(req.query.skip) : 0;
    const sortBy = req.query.sortBy ? req.query.sortBy : '_id';
    const order = req.query.order ? req.query.order : 'desc';
    console.log(slug, limit, skip);

    try {
      const product = await Product.findOne({ slug });
      const total = await Review.find({
        productId: product._id,
      }).countDocuments();
      const reviews = await Review.find({ productId: product._id })
        .populate('userId', 'username avatar')
        .sort({ [sortBy]: order })
        .skip(skip)
        .limit(limit);
      return res.json({
        success: true,
        result: {
          reviews,
          limit,
          skip,
          sortBy,
          order,
          total,
        },
      });
    } catch (error) {
      console.log(errors);
    }
  },
  likeReview: async (req, res) => {
    const { reviewId, type } = req.body;
    console.log('Hit api');
    try {
      let review = await Review.findById(reviewId);
      console.log(review);
      if (review.likes.find((x) => x.toString() === req.user._id.toString())) {
        console.log('already in likes');
        console.log(type);
        if (type === 'like') {
          review.likes = review.likes.filter(
            (r) => r.toString() !== req.user._id.toString()
          );
        } else {
          review.likes = review.likes.filter(
            (r) => r.toString() !== req.user._id.toString()
          );
          review.dislikes.push(req.user._id);
        }
      } else {
        console.log('not in likes');
        if (type === 'like') {
          review.likes.push(req.user._id);
          review.dislikes = review.dislikes.filter(
            (r) => r.toString() !== req.user._id.toString()
          );
        } else {
          const isInDislikes = review.dislikes.find(
            (x) => x.toString() === req.user._id.toString()
          );
          if (isInDislikes) {
            review.dislikes = review.dislikes.filter(
              (r) => r.toString() !== req.user._id.toString()
            );
          } else {
            review.dislikes.push(req.user._id);
          }
        }
      }
      const updatedReview = await review.save();
      // console.log(updatedReview);
      // await Review.findByIdAndUpdate(reviewId, {
      //   dislikes: review.dislikes,
      //   likes: review.likes,
      // });
      console.log('updatedReview', updatedReview);
      return res.json({
        success: true,
        review: updatedReview,
      });
    } catch (error) {
      console.log('error', error);
    }
  },
};
