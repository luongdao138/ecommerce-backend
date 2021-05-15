const Category = require('../models/category');
const { categoryValidator } = require('../utils/validators');
const slugify = require('slugify');
const { createCategories } = require('../utils/categories');

module.exports = {
  createCategory: async (req, res) => {
    const { errors, isValid } = categoryValidator(req.body);
    if (!isValid)
      return res.status(400).json({
        success: false,
        error: errors[Object.keys(errors)[0]],
      });

    const { name, description, type } = req.body;
    let catObj = {
      name,
      type,
      description,
      slug: slugify(name, {
        remove: /[*+~.()'"!:@]/g,
      }),
    };
    if (req.file) {
      catObj.image = req.file.filename;
    }

    if (req.body.parentId) {
      catObj.parentId = req.body.parentId;
    }
    const newCat = new Category(catObj);
    try {
      const savedCat = await newCat.save();
      return res.json({
        success: true,
        category: savedCat,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: 'This category name already existed!',
      });
    }
  },
  getCategories: async (req, res) => {
    try {
      const parentCategories = await Category.find();
      const categories = createCategories(parentCategories);
      return res.json({
        success: true,
        categories,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        error,
      });
    }
  },
  updateCategory: async (req, res) => {
    const { _id, name, type, parentId } = req.body;
    const updatedCategories = [];

    if (name instanceof Array) {
      for (let i = 0; i < name.length; i++) {
        // const category = await Category.findById(_id[i]);
        let catObj = {
          name: name[i],
          type: type[i],
          slug: slugify(name[i], {
            remove: /[*+~.()'"!:@]/g,
          }),
        };

        // if (req.files[i]) {
        //   console.log(req.files[i]);
        //   if (category.image) {
        //     fs.unlinkSync(
        //       path.join(
        //         path.dirname(__dirname),
        //         'uploads',
        //         'categories',
        //         category.image
        //       )
        //     );
        //   }
        //   catObj.image = req.files[i].filename;
        // }

        if (parentId[i] !== '') catObj.parentId = parentId[i];

        const updatedCategory = await Category.findByIdAndUpdate(
          _id[i],
          catObj,
          {
            new: true,
          }
        );
        updatedCategories.push(updatedCategory);
      }
      return res.json({
        success: true,
        categories: updatedCategories,
      });
    } else {
      let catObj = {
        name: name,
        type: type,
        slug: slugify(name, {
          remove: /[*+~.()'"!:@]/g,
        }),
      };

      if (parentId !== '') catObj.parentId = parentId;

      const updatedCategory = await Category.findByIdAndUpdate(_id, catObj, {
        new: true,
      });
      return res.json({
        success: true,
        categories: updatedCategory,
      });
    }
  },
  deleteCategories: async (req, res) => {
    const { ids } = req.body;
    console.log(ids);
    let deletedCategories = [];
    try {
      for (let id of ids) {
        const deletedCategory = await Category.findByIdAndDelete(id);
        deletedCategories.push(deletedCategory);
      }
      if (deletedCategories.length === ids.length) {
        return res.json({
          success: true,
          messsage: 'Delete succesfully!',
        });
      }
      return res.json({
        success: false,
        messsage: 'Delete categories failed, please try again!',
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: 'Delete categories failed, please try again!',
      });
    }
  },
};
