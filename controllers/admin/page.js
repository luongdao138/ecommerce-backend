const Page = require('../../models/page');
const { pageValidator } = require('../../utils/validators');

module.exports = {
  createPage: async (req, res) => {
    const { errors, isValid } = pageValidator(req.body);
    if (!isValid) {
      return res.status(400).json({
        success: false,
        error: errors[Object.keys(errors)[0]],
      });
    }

    const { title, description, type, category } = req.body;
    let { banners, products } = req.files;
    if (banners && banners.length > 0) {
      banners = banners.map((banner) => ({
        image: banner.filename,
        navigateTo: `/bannerClicked?categoryId=${category}&type=${type}`,
      }));
    }

    if (products && products.length > 0) {
      products = products.map((product) => ({
        image: product.filename,
        navigateTo: `/productClicked?categoryId=${category}&type=${type}`,
      }));
    }

    try {
      let pageObj = {
        title,
        description,
        category,
      };
      if (banners) pageObj.banners = banners;
      if (products) pageObj.products = products;
      const existingPage = await Page.findOne({ category });
      if (existingPage) {
        const updatedPage = await Page.findOneAndUpdate({ category }, pageObj, {
          new: true,
        });
        return res.json({
          success: true,
          page: updatedPage,
        });
      } else {
        const newPage = new Page(pageObj);
        const savedPage = await newPage.save();

        return res.json({
          success: true,
          page: savedPage,
        });
      }
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: 'Create page failed, please try again!',
      });
    }
  },
  getPage: async (req, res) => {
    const { category, type } = req.params;
    if (type === 'page') {
      try {
        const page = await Page.findOne({ category });
        if (!page)
          return res.status(400).json({
            success: false,
            error: 'Category not found!',
          });
        return res.json({
          success: true,
          page,
        });
      } catch (error) {
        return res.status(400).json({
          success: false,
          error: 'There is some error, please try again!',
        });
      }
    } else {
      return res.status(400).json({
        success: false,
        error: 'There is some error, please try again!',
      });
    }
  },
};
