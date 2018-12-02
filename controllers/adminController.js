const multer = require('multer')
const fs = require('fs')
const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category

let adminController = {
  getRestaurants: (req, res) => {
    return Restaurant.findAll({include: [Category]}).then(restaurants => {
      return res.render('admin/restaurants', {restaurants: restaurants, user: req.user, isAuthenticated: req.isAuthenticated})
    })
  },
  getRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, {include: [Category]}).then(restaurant => {
      return res.render('admin/restaurant', {restaurant: restaurant, user: req.user, isAuthenticated: req.isAuthenticated})
    })
  },
  createRestaurant: (req, res) => {
    Category.findAll().then(categories => {
      return res.render('admin/create', {categories: categories})
    })
    
  },
  editRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id).then(restaurant => {
      Category.findAll().then(categories => {
        return res.render('admin/create', {categories: categories, restaurant: restaurant, user: req.user, isAuthenticated: req.isAuthenticated})
      })
    })
  },
  postRestaurant: (req, res) => {
    const { file } = req
    if(file)
      fs.readFile(file.path, (err, data) => {
        fs.writeFile(`upload/${file.originalname}`, data, () => {
        })
      })

    return Restaurant.create({
      name: req.body.name,
      tel: req.body.tel,
      address: req.body.address,
      opening_hours: req.body.opening_hours,
      description: req.body.description,
      image: file ? file.originalname : null,
      createdAt : new Date(),
      updatedAt : new Date(),
      CategoryId: req.body.categoryId
     })
     .then(function (restaurant) {
       res.redirect('/admin/restaurants')
     });
  },
  putRestaurant: (req, res) => {
    const { file } = req
    if(file)
      fs.readFile(file.path, (err, data) => {
        fs.writeFile(`upload/${file.originalname}`, data, () => {
        })
      })

    return Restaurant.findByPk(req.params.id)
      .then(function (restaurant) {
        restaurant.updateAttributes({
          name: req.body.name,
          tel: req.body.tel,
          address: req.body.address,
          opening_hours: req.body.opening_hours,
          description: req.body.description,
          image: file ? file.originalname : restaurant.image,
          createdAt : new Date(),
          CategoryId: req.body.categoryId
         })
        .then(function(restaurant) {
          res.redirect('/admin/restaurants')
        });
      });
  },
  deleteRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id)
      .then(function (restaurant) {
        restaurant.destroy()
          .then(function(restaurant) {
            res.redirect('/admin/restaurants')
          });
      });
  },
}
module.exports = adminController