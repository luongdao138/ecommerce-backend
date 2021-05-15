const Banner = require('../models/banner');
const { bannerValidator } = require('../utils/validators');
const fs = require('fs');
const path = require('path');

module.exports = {
  createBanner: async (req, res) => {
    const { errors, isValid } = bannerValidator(req);
    if (!isValid)
      return res.status(400).json({
        success: false,
        error: errors[Object.keys(errors)[0]],
      });

    const { status, navigateTo } = req.body;
    const newBanner = new Banner({
      status,
      navigateTo,
      image: req.file.filename,
    });

    try {
      const savedBanner = await newBanner.save();
      return res.json({
        success: true,
        banner: savedBanner,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: 'Add banner failed, please try again!',
      });
    }
  },
  getBanners: async (req, res) => {
    try {
      const { type } = req.query;
      let banners;

      if (type === 'admin') banners = await Banner.find().sort({ _id: -1 });
      else banners = await Banner.find({ status: true }).sort({ _id: -1 });

      return res.json({
        success: true,
        banners,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: 'Get banners failed, please try again!',
      });
    }
  },
  updateBanner: async (req, res) => {
    if (!req.body.navigateTo || req.body.navigateTo.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Url is required!',
      });
    }
    console.log('hit update');
    const { id } = req.params;
    const banner = await Banner.findById(id);
    if (!banner)
      return res.status(400).json({
        success: false,
        error: 'Banner not found!',
      });

    const { navigateTo, status } = req.body;
    const bannerObj = {
      navigateTo,
      status,
    };

    try {
      if (req.file) {
        fs.unlinkSync(
          path.join(path.dirname(__dirname), 'uploads', 'banners', banner.image)
        );
        bannerObj.image = req.file.filename;
      }

      const updatedBanner = await Banner.findByIdAndUpdate(id, bannerObj, {
        new: true,
      });
      return res.json({
        success: true,
        banner: updatedBanner,
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        success: false,
        error: 'Update failed, please try again!',
      });
    }
  },
  deleteBanner: async (req, res) => {
    const { id } = req.params;
    try {
      const banner = await Banner.findById(id);
      if (!banner)
        return res.status(400).json({
          success: false,
          error: 'Banner not found!',
        });
      fs.unlinkSync(
        path.join(path.dirname(__dirname), 'uploads', 'banners', banner.image)
      );
      await Banner.findByIdAndDelete(id);
      return res.json({
        success: true,
        id,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: 'Delete banner failed, please try again!',
      });
    }
  },
};
