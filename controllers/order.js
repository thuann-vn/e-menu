const Order = require('../models/Order');
const multer = require('multer');
const fs = require('fs');
const util = require('util')

/**
 * GET /
 * Emenu index.
 */
exports.index = (req, res) => {
  //Get list food and drinks
  Order.find({}).sort({"createAt": -1}).exec(function(err, items){
    if (err) { return next(err); }
    res.render('order/index', {
      title: 'Order',
      orders: items
    });
  });
};

/**
 * GET /order/edit/:id
 * Emenu edit.
 */
exports.getEdit = (req, res) => {
  //Get list food and drinks
  Order.findById(req.params.id, function(err, order){
    if (err) { return next(err); }
    res.render('order/edit', {
      title: 'Order',
      order: order
    });
  })
};

/**
/**
 * POST /order/delete
 * Delete menu
 */
exports.postDelete = (req, res, next) => {
  //Validate rules
  req.assert('id', 'Invalid menu ID').notEmpty();

  //Check request
  const errors = req.validationErrors();
  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/order');
  }

  //Check if menu item existed before insert
  Order.deleteOne({_id: req.body.id}, (err) => {
    if (err) { return next(err); }

    req.flash('success', { msg: 'Order deleted successfully.' });
      return res.redirect('/order');
  });
};