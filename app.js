const express = require('express');
const app = express();
const mongoose = require('mongoose');
require('dotenv').config();
const path = require('path');

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  '/uploads/products',
  express.static(path.join(__dirname, 'uploads', 'products'))
);
app.use(
  '/uploads/categories',
  express.static(path.join(__dirname, 'uploads', 'categories'))
);
app.use(
  '/uploads/page_banners',
  express.static(path.join(__dirname, 'uploads', 'page_banners'))
);

app.use(
  '/uploads/banners',
  express.static(path.join(__dirname, 'uploads', 'banners'))
);

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.header(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE'
  );
  next();
});

// connect to mongodb database
mongoose
  .connect(process.env.CONNECT_DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('Connected db successfully!');
    return app.listen(PORT);
  })
  .then(() => console.log(`Server is running on port ${PORT}`))
  .catch((error) => {
    console.log(error);
    process.exit(0);
  });

// import routes
const adminAuthRouter = require('./routes/admin/auth');
const pageRouter = require('./routes/admin/page');
const authRouter = require('./routes/auth');
const categoryRouter = require('./routes/category');
const productRouter = require('./routes/product');
const orderRouter = require('./routes/order');
const bannerRouter = require('./routes/banner');

// router middlewares
app.use('/api/v1/admin/auth', adminAuthRouter);
app.use('/api/v1/admin/pages', pageRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/categories', categoryRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/orders', orderRouter);
app.use('/api/v1/banners', bannerRouter);
