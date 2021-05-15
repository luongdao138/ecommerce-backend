const Product = require('../models/product');
const { productValidator } = require('../utils/validators');
const slugify = require('slugify');
const Category = require('../models/category');
const Page = require('../models/page');
const {
  getDescendantCats,
  createCategories,
  findCatBySlug,
} = require('../utils/categories');

module.exports = {
  createProduct: async (req, res) => {
    const { errors, isValid } = productValidator(req.body);
    if (!isValid)
      return res.status(400).json({
        success: false,
        error: errors[Object.keys(errors)[0]],
      });

    const { title, description, price, category, quantity } = req.body;

    let productObj = {
      title,
      description,
      price,
      quantity,
      category,
      slug: slugify(title, {
        remove: /[*+~.()'"!:@]/g,
      }),
      createdBy: req.user._id,
      updatedBy: req.user._id,
    };

    if (req.files.length > 0) {
      productObj.images = req.files.map((file) => file.filename);
    }

    const newProduct = new Product(productObj);
    const savedProduct = await newProduct.save();
    return res.json({
      success: true,
      product: savedProduct,
    });
  },
  getProducts: async (req, res) => {
    const order = req.query.order ? req.query.order : 'desc';
    const sortBy = req.query.sortBy ? req.query.sortBy : '_id';
    const limit = req.query.limit ? Number(req.query.limit) : 100;
    const skip = Number(req.query.skip);

    try {
      const products = await Product.find({}, { reviews: 0, ratings: 0 })
        .populate('category', 'name')
        .sort({ [sortBy]: order })
        .skip(skip)
        .limit(limit);
      const total = await Product.countDocuments();
      return res.json({
        success: true,
        result: {
          list: products,
          skip: skip || 0,
          limit,
          total,
          order,
          sortBy,
        },
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        success: false,
        error: 'Get products failed!',
      });
    }
  },
  getProductsBySlug: async (req, res) => {
    const { slug } = req.params;
    const type = req.query.type;
    const order = req.query.order ? req.query.order : 'desc';
    const sortBy = req.query.sortBy ? req.query.sortBy : '_id';
    const limit = req.query.limit ? Number(req.query.limit) : 100;
    const skip = Number(req.query.skip);
    const parentCategories = await Category.find();
    const categories = createCategories(parentCategories);
    const category = findCatBySlug(slug, categories);
    if (!category)
      return res.status(400).json({
        success: false,
        error: 'Category not found!',
      });
    const descendants = getDescendantCats(category);

    if (type == 'product') {
      let products = await Product.find(
        { category: { $in: descendants } },
        { description: 0 }
      )
        .sort({ [sortBy]: order })
        .skip(skip)
        .limit(limit);
      const total = await Product.find({
        category: { $in: descendants },
      }).countDocuments();
      products = products.map((product) => ({
        ...product._doc,
        reviewCount: product.reviews.length,
        ratingCount: product.ratings.length,
      }));

      return res.json({
        success: true,
        result: {
          total,
          list: products,
          skip: skip || 0,
          limit,
          total,
          order,
          sortBy,
          category: category.name,
        },
      });
    } else if (type === 'page') {
      console.log(category);
      const page = await Page.findOne({ category: category._id });
      return res.json({
        success: true,
        result: { page },
      });
    }
    return res.send('OK');
  },
};
