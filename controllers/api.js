const request = require('request');
const Menu = require('../models/Menu');
const Order = require('../models/Order');

const ORDERCODEPREFIX = 'EM-';  
/**
 * GET /api
 * List of API examples.
 */
exports.getApi = (req, res) => {
  res.render('api/index', {
    title: 'API Examples'
  });
};

/**
 * GET /api/get-menu
 * Get menu list
 */

exports.getMenu = (req, res) => {
  Menu.find({}).sort({"displayOrder": 1}).exec(function(err, items){
    if (err) { return next(err); }
    res.send(JSON.stringify(items));
  });
};

/**
 * GET /api/checkout
 * Checkout API
 */
exports.postCheckout = (req, res) => {
  //Validate rules
  req.assert('name', 'Customer Name cannot be blank').notEmpty();
  req.assert('phone', 'Customer Phone cannot be blank').notEmpty();

  //Check request
  const errors = req.validationErrors();
  if (errors) {
    return res.send(JSON.stringify({status: 'validate_error', message: errors}));
  }  

  //Generate order code
  var lastedOrderCode = '10001';

  //Get lastest order
  Order.findOne({}, {}, { sort: { 'createdAt' : -1 } }, function(err, lastestOrder) {
    if(lastestOrder){
      lastedOrderCode = lastestOrder.orderCode;
    }
    var newOrderCode = ORDERCODEPREFIX + (parseInt(lastedOrderCode.replace(ORDERCODEPREFIX, '')) + 1);

    //Sum total
    var cart = req.body.cart;
    var total = 0;
    cart.forEach(cartItem => {
      total+= cartItem.price * cartItem.quantity;
    });

    var order = new Order({
      orderCode : newOrderCode,
      customerName: req.body.name,
      customerPhone: req.body.phone, 
      detail: req.body.cart,
      total: total,
      status: 0
    });

    order.save((err) => {
      if (err) { return next(err); }
      return res.send(JSON.stringify({status: 'success', data: order}));
    });
  });
};
