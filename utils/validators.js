const registerValidator = (body) => {
  const { firstName, lastName, username, email, password } = body;
  const errors = {};

  if (!firstName || firstName.trim() === '')
    errors.firstName = 'First name is required!';
  else if (firstName.length > 20 || firstName.length < 3)
    errors.firstName = 'First name must be from 3 to 20 characters length!';

  if (!username || username.trim() === '')
    errors.username = 'Username is required!';
  else if (username.length > 30 || username.length < 3)
    errors.username = 'Username must be from 3 to 30 characters length!';

  if (!lastName || lastName.trim() === '')
    errors.lastName = 'Last name is required!';
  else if (lastName.length > 20 || lastName.length < 3)
    errors.lastName = 'Last name must be from 3 to 20 characters length!';

  if (!email || email.trim() === '') errors.email = 'Email is required!';
  else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}/g.test(email))
    errors.lastName = 'Email is not valid';

  if (!password || password.trim() === '')
    errors.password = 'Password is required!';
  else if (password.length > 50 || password.length < 6)
    errors.password = 'Password must be from 6 to 50 characters length!';

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};

const loginValidator = (body) => {
  const { email, password } = body;
  const errors = {};

  if (!email || email.trim() === '') errors.email = 'Email is required!';
  else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}/g.test(email))
    errors.lastName = 'Email is not valid';

  if (!password || password.trim() === '')
    errors.password = 'Password is required!';
  else if (password.length > 50 || password.length < 6)
    errors.password = 'Password must be from 6 to 50 characters length!';

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};

const categoryValidator = (body) => {
  const errors = {};
  const { name } = body;
  if (!name || name.trim() === '') errors.name = 'name is required!';
  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};

const productValidator = (body) => {
  const errors = {};
  const { title, description, price, category, quantity } = body;
  if (!title || title.trim() === '') errors.title = 'Title is required!';
  if (!description || description.trim() === '')
    errors.description = 'Description is required!';
  if (!price || price.trim() === '') errors.price = 'Price is required!';
  else if (Number.isNaN(price)) errors.price = 'Price must be a number!';
  if (!category || category.trim() === '')
    errors.category = 'Category is required!';
  if (!quantity || quantity.trim() === '')
    errors.quantity = 'Quantity is required!';

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};

const pageValidator = (body) => {
  const errors = {};
  const { title, description, category } = body;
  if (!title || title.trim() === '') errors.title = 'Title is required!';
  if (!description || description.trim() === '')
    errors.description = 'Description is required!';

  if (!category || category.trim() === '')
    errors.category = 'Category is required!';

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};

const bannerValidator = (req) => {
  const errors = {};
  const { navigateTo } = req.body;
  if (!navigateTo || navigateTo.trim() === '')
    errors.navigateTo = 'Url is required!';

  if (!req.file) errors.image = 'Image is required!';

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};

module.exports = {
  registerValidator,
  loginValidator,
  categoryValidator,
  productValidator,
  pageValidator,
  bannerValidator,
};
