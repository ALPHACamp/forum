const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category

let restController = {
  getRestaurants: (req, res) => {
    return Restaurant.findAll({include: [Category]}).then(restaurants => {
     return res.render('restaurants', {restaurants: restaurants, user: req.user, isAuthenticated: req.isAuthenticated})
    })
  },
  getRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, {include: [Category]}).then(restaurant => {
      return res.render('restaurant', {restaurant: restaurant, user: req.user, isAuthenticated: req.isAuthenticated})
    })
  },
}
module.exports = restController