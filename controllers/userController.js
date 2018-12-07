const db = require('../models')
const User = db.User
const Restaurant = db.Restaurant
const Favorite = db.Favorite

let userController = {
  getUser: (req, res) => {
    return User.findByPk(req.user.id, {include: [{ model: Restaurant, as: 'UserFavorite' }]}).then(user => {
      return res.render('profile', {user: user, isAuthenticated: req.isAuthenticated})
    })
  },
  addFavorite: (req, res) => {
    return Favorite.create({
      UserId: req.user.id,
      RestaurantId: req.params.restaurantId,
      createdAt : new Date(),
      updatedAt : new Date(),
     })
     .then(function (restaurant) {
       return res.redirect(`/restaurants/${req.params.restaurantId}`)
     });
  },
  removeFavorite: (req, res) => {
    return Favorite.findOne({where: {userId: req.user.id, RestaurantId: req.params.restaurantId}})
      .then(function (favorite) {
        favorite.destroy()
         .then(function (restaurant) {
           return res.redirect(`/profile`)
       });
    });
  },
}
module.exports = userController

