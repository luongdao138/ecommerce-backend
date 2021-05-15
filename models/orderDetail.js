const { Schema, model } = require('mongoose');

const orderDetailSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: {
    type: Number,
    default: 1,
  },
  price: {
    type: Number,
    required: true,
  },
});

const OrderDetail = model('OrderDetail', orderDetailSchema);
module.exports = OrderDetail;
