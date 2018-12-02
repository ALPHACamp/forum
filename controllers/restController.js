const db = require('../models')
const Restaurant = db.Restaurant

let restController = {
  getRestaurants: (req, res) => {
    return Restaurant.findAll().then(restaurants => {
      return res.render('restaurants', {restaurants: restaurants})
    })
  },
  getRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id).then(restaurant => {
      return res.render('restaurant', {restaurant: restaurant})
    })
  },
}
module.exports = restController