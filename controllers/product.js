const Product = require('../models/product');
const { productValidator } = require('../utils/validators');
const slugify = require('slugify');
const Category = require('../models/category');
const Page = require('../models/page');
const fs = require('fs');
const path = require('path');

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

    const { title, discountPrice, description, price, category, quantity } =
      req.body;

    let productObj = {
      title,
      description,
      price,
      quantity,
      discountPrice,
      category,
      slug: slugify(title, {
        remove: /[*+~.(),'"!:@]/g,
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
  getProductsByCategorySlug: async (req, res) => {
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
  getProductBySlug: async (req, res) => {
    const { slug } = req.params;
    try {
      const product = await Product.findOne({ slug });
      if (!product)
        return res.status(400).json({
          success: false,
          error: 'Product not found!',
        });

      return res.json({
        success: true,
        product,
      });
    } catch (error) {
      console.log(error);
    }
  },
  updateProduct: async (req, res) => {
    const { errors, isValid } = productValidator(req.body);
    if (!isValid)
      return res.status(400).json({
        success: false,
        error: errors[Object.keys(errors)[0]],
      });
    const { slug } = req.params;

    try {
      const product = await Product.findOne({ slug });
      if (!product)
        return res.status(400).json({
          success: false,
          error: 'Product not found!',
        });

      const {
        title,
        discountPrice,
        description,
        price,
        category,
        quantity,
        specifications,
        hightlights,
      } = req.body;

      const updateObj = {
        title,
        discountPrice,
        description,
        price,
        category,
        quantity,
        specifications,
        hightlights,
        slug: slugify(title, {
          remove: /[*+~.(),'"!:@]/g,
        }),
        updatedBy: req.user._id,
        updatedAt: new Date(),
      };

      await Product.findByIdAndUpdate(product._id, updateObj);
      return res.json({
        success: true,
        message: 'Update product successfully!',
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        success: false,
        error: 'Update failed, please try again!',
      });
    }
  },
  uploadMorePhotos: async (req, res) => {
    console.log('hit api');
    let images = req.files;
    images = images.map((x) => x.filename);
    console.log(images);

    const { slug } = req.params;
    try {
      const product = await Product.findOne({ slug });
      if (!product)
        return res.status(400).json({
          success: false,
          error: 'Product not found!',
        });

      await Product.updateOne(
        { _id: product._id },
        {
          $push: { images },
        }
      );
      return res.json({
        success: true,
        images,
        message: 'Uploads photos successfully!',
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        success: false,
        error: 'Uploads failed, please try again!',
      });
    }
  },
  updatePhoto: async (req, res) => {
    const { filename } = req.body;

    const image = req.file;
    const { slug } = req.params;

    try {
      const product = await Product.findOne({ slug });
      if (!product)
        return res.status(400).json({
          success: false,
          error: 'Product not found!',
        });

      fs.unlinkSync(
        path.join(path.dirname(__dirname), 'uploads', 'products', filename)
      );

      let newImages = product.images;
      newImages = newImages.map((x) => (x === filename ? image.filename : x));

      await Product.updateOne({ slug }, { images: newImages });
      return res.json({
        success: true,
        images: newImages,
        message: 'Update photo successfully!',
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        success: false,
        error: 'Update failed, please try again!',
      });
    }
  },
  deletePhoto: async (req, res) => {
    const { filename } = req.body;
    const { slug } = req.params;

    try {
      const product = await Product.findOne({ slug });
      if (!product)
        return res.status(400).json({
          success: false,
          error: 'Product not found!',
        });

      fs.unlinkSync(
        path.join(path.dirname(__dirname), 'uploads', 'products', filename)
      );

      let newImages = product.images;
      newImages = newImages.filter((x) => x !== filename);

      await Product.updateOne({ slug }, { images: newImages });
      return res.json({
        success: true,
        images: newImages,
        message: 'Delete photo successfully!',
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        success: false,
        error: 'Delete failed, please try again!',
      });
    }
  },
};
