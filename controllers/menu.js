const Menu = require('../models/Menu');
const multer = require('multer');
const fs = require('fs');
const util = require('util')

/**
 * GET /
 * Emenu index.
 */
exports.index = (req, res) => {
  //Get list food and drinks
  Menu.find({}).sort({"displayOrder": 1}).exec(function(err, items){
    if (err) { return next(err); }
    res.render('menu/index', {
      title: 'E-Menu',
      items: items
    });
  });
};

/**
 * GET /e-menu/edit/:id
 * Emenu edit.
 */
exports.getEdit = (req, res) => {
  //Get list food and drinks
  Menu.findById(req.params.id, function(err, menuItem){
    if (err) { return next(err); }
    res.render('menu/edit', {
      title: 'E-Menu',
      item: menuItem
    });
  })
};

/**
 * POST /e-menu/createorupdate
 * Create or update.
 */
exports.postCreateOrUpdate = (req, res, next) => {
  //Validate rules
  req.assert('name', 'Name cannot be blank').notEmpty();
  req.assert('price', 'Price cannot be blank').notEmpty();
  req.assert('display_order', 'Display order cannot be blank').notEmpty();

  //Check request
  const errors = req.validationErrors();
  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/e-menu');
  }
  
  var uploadedImage = '';
  if(req.file){
     //Encode image to base 64
     var filePath = req.file.path;
     var bitmap = fs.readFileSync(filePath);
     uploadedImage = util.format("data:image/gif;base64,%s", new Buffer(bitmap).toString('base64'));

     //Delete image file
     fs.unlink(filePath, (err) => {
       if (err) throw err;
     });
  }

  //Check if update
  if(req.body.id){
    //Check if menu item existed before insert
    Menu.findById(req.body.id, (err, menuItem) => {
      if (err) { return next(err); }
      if (!menuItem) {
        req.flash('errors', { msg: 'Update invalid menu item.' });
        return res.redirect('/e-menu');
      }
      
      menuItem.name = req.body.name;
      menuItem.price = req.body.price;
      menuItem.displayOrder = req.body.display_order;
      if(uploadedImage){
        menuItem.image = uploadedImage;
      }
      
      menuItem.save((err) => {
        if (err) { return next(err); }
        req.flash('success', { msg: 'Menu item updated successfully.' });
        return res.redirect('/e-menu');
      });
    });
  }else{
    //Check if menu item existed before insert
    Menu.findOne({ name: req.body.name }, (err, existingMenuItem) => {
      if (err) { return next(err); }
      if (existingMenuItem) {
        req.flash('errors', { msg: 'Menu item with this name is existed, please choose another name.' });
        return res.redirect('/e-menu');
      }
      
      const menuItem = new Menu({
        name: req.body.name,
        price: req.body.price,
        displayOrder: req.body.display_order,
        image: uploadedImage
      });
      
      menuItem.save((err) => {
        if (err) { return next(err); }
        req.flash('success', { msg: 'Menu item created successfully.' });
        return res.redirect('/e-menu');
      });
    });
  }
};

/**
 * POST /e-menu/delete
 * Delete menu
 */
exports.postDelete = (req, res, next) => {
  //Validate rules
  req.assert('id', 'Invalid menu ID').notEmpty();

  //Check request
  const errors = req.validationErrors();
  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/e-menu');
  }

  //Check if menu item existed before insert
  Menu.deleteOne({_id: req.body.id}, (err) => {
    if (err) { return next(err); }

    req.flash('success', { msg: 'Menu item deleted successfully.' });
      return res.redirect('/e-menu');
  });
};