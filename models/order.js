const { Schema, model } = require('mongoose');
const orderDetailSchema = require('./orderDetail').schema;

const orderSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  orderDetails: [orderDetailSchema],
  status: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Order = model('Order', orderSchema);
module.exports = Order;
