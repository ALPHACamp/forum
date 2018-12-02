const db = require('../models')
const Restaurant = db.Restaurant

let adminController = {
  getRestaurants: (req, res) => {
    return Restaurant.findAll().then(restaurants => {
      return res.render('admin/restaurants', {restaurants: restaurants})
    })
  },
  getRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id).then(restaurant => {
      return res.render('admin/restaurant', {restaurant: restaurant})
    })
  },
  createRestaurant: (req, res) => {
    return res.render('admin/create')
  },
  editRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id).then(restaurant => {
      return res.render('admin/create', {restaurant: restaurant})
    })
  },
  postRestaurant: (req, res) => {
    return Restaurant.create({
      name: req.body.name,
      tel: req.body.tel,
      address: req.body.address,
      opening_hours: req.body.opening_hours,
      description: req.body.description,
      createdAt : new Date(),
      updatedAt : new Date(),
     })
     .then(function (restaurant) {
       res.redirect('/admin/restaurants')
     });
  },
  putRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id)
      .then(function (restaurant) {
        restaurant.updateAttributes(req.body)
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