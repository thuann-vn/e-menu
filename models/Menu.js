const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  image: String,
  price: Number,
  displayOrder: Number
}, { timestamps: true });

const Menu = mongoose.model('Menu', menuSchema);

module.exports = Menu;
