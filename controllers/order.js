const Order = require('../models/order');

module.exports = {
  createOrder: async (req, res) => {
    const orderObj = {
      user: req.user._id,
      orderDetails: req.body.orderDetails,
    };
    const newOrder = new Order(orderObj);
    const savedOrder = await newOrder.save();
    return res.json({
      sucess: true,
      order: savedOrder,
    });
  },
};
