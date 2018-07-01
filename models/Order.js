const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderCode: String,
  customerName: String,
  customerPhone: String,
  total: Number,
  detail: Array
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
module.exports = mongoose.model('Order', orderSchema);
