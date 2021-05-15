const getDescendantCats = (category) => {
  let result = [];
  result.push(category._id);
  if (category.children.length > 0) {
    for (let cat of category.children) {
      result = [...result, ...getDescendantCats(cat)];
    }
  }

  return result;
};

const createCategories = (parentCategories, parentId = undefined) => {
  const categories = [];
  let temp;
  if (!parentId) {
    temp = parentCategories.filter((cat) => cat.parentId == undefined);
  } else {
    temp = parentCategories.filter(
      (cat) => cat.parentId?.toString() == parentId.toString()
    );
  }

  for (let cat of temp) {
    categories.push({
      _id: cat._id,
      name: cat.name,
      slug: cat.slug,
      image: cat.image,
      parentId: cat.parentId,
      description: cat.description,
      type: cat.type,
      children: createCategories(parentCategories, cat._id),
    });
  }

  return categories;
};

const findCatBySlug = (slug, categories) => {
  for (let cat of categories) {
    if (cat.slug === slug) {
      return cat;
    } else {
      const result = findCatBySlug(slug, cat.children);
      if (result) return result;
    }
  }

  return null;
};

module.exports = {
  getDescendantCats,
  createCategories,
  findCatBySlug,
};
