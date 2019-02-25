const db = require('../models')
const User = db.User
const Restaurant = db.Restaurant
const Favorite = db.Favorite
const Followship = db.Followship

let userController = {
  getUser: (req, res) => {
    return User.findByPk(req.params.id, {
      include: [
        { model: Restaurant, as: 'UserFavorite' },
        { model: User, as: 'Follower' },
        { model: User, as: 'Following' }
      ]
    }).then(user => {
      const deletable = req.user.id === +req.params.id
      const followed = user.Follower.map(d => d.id).includes(req.user.id)
      return res.render('profile', { user: req.user, isAuthenticated: req.isAuthenticated, profile: user, deletable: deletable, followed: followed })
    })
  },
  getTopUser: (req, res) => {
    return User.findAll({
      include: [
        { model: User, as: 'Follower' },
      ]
    }).then(users => {
      users = users.map(user => ({
        ...user.dataValues, FollowerCount: user.Follower.length
      }))
      users = users.sort((a,b) => b.FollowerCount - a.FollowerCount)
      return res.render('topUser', { user: req.user, isAuthenticated: req.isAuthenticated, users: users })
    })
  },
  addFavorite: (req, res) => {
    return Favorite.create({
      UserId: req.user.id,
      RestaurantId: req.params.restaurantId,
      createdAt: new Date(),
      updatedAt: new Date()
    })
     .then((restaurant) => {
       return res.redirect(`/restaurants/${req.params.restaurantId}`)
     })
  },
  removeFavorite: (req, res) => {
    return Favorite.findOne({where: {userId: req.user.id, RestaurantId: req.params.restaurantId}})
      .then((favorite) => {
        favorite.destroy()
         .then((restaurant) => {
           return res.redirect(`/profile/${req.user.id}`)
         })
      })
  },
  addFollowing: (req, res) => {
    return Followship.create({
      followerId: req.user.id,
      followingId: req.params.userId,
      createdAt: new Date(),
      updatedAt: new Date()
    })
     .then((followship) => {
       return res.redirect(`/profile/${req.params.userId}`)
     })
  },
  removeFollowing: (req, res) => {
    return Followship.findOne({where: {followerId: req.user.id, followingId: req.params.userId}})
      .then((followship) => {
        followship.destroy()
         .then((followship) => {
           return res.redirect(`/profile/${req.params.userId}`)
         })
      })
  }
}
module.exports = userController
