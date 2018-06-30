const request = require('request');
const Menu = require('../models/Menu');

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
 * GET /api/upload
 * File Upload API example.
 */

exports.getMenu = (req, res) => {
  //Get list food and drinks
  Menu.find({}).sort({"displayOrder": 1}).exec(function(err, items){
    if (err) { return next(err); }
    res.send(JSON.stringify(items));
  });
};
