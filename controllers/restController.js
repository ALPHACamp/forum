const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category
const Comment = db.Comment
const User = db.User

let restController = {
  getRestaurants: (req, res) => {
    return Restaurant.findAll({include: [Category]}).then(restaurants => {
      return res.render('restaurants', {restaurants: restaurants, user: req.user, isAuthenticated: req.isAuthenticated})
    })
  },
  getRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, {include: [Category, {model: Comment, include: [User]}]}).then(restaurant => {
      return res.render('restaurant', {restaurant: restaurant, user: req.user, isAuthenticated: req.isAuthenticated})
    })
  }
}
module.exports = restController
