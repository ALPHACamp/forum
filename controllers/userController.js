const fs = require('fs')
const imgur = require('imgur-node-api')
const db = require('../models')
const User = db.User
const Restaurant = db.Restaurant
const Favorite = db.Favorite
const Followship = db.Followship
const Comment = db.Comment

let userController = {
  getUser: (req, res) => {
    return User.findByPk(req.params.id, {
      include: [
        { model: Restaurant, as: 'UserFavorite' },
        { model: User, as: 'Follower' },
        { model: User, as: 'Following' },
        { model: Comment, include: 'Restaurant' },
      ]
    }).then(user => {
      const isFollowed = req.user.Following.map(d => d.id).includes(user.id)
      return res.render('profile', { profile: user, isFollowed: isFollowed, user: req.user })
    })
  },
  editUser: (req, res) => {
    return User.findByPk(req.params.id).then(user => {
      return res.render('user/edit', {user: user})
    })
  },
  putUser: (req, res) => {
    const { file } = req
    if (file) {
      fs.readFile(file.path, (err, data) => {
        if (err) console.log('Error: ', err)
        fs.writeFile(`upload/${file.originalname}`, data, () => {
          imgur.setClientID('');
          imgur.upload(`upload/${file.originalname}`, (err, img) => {
            return User.findByPk(req.params.id)
              .then((user) => {
                user.update({
                  name: req.body.name,
                  image: img.data.link,
                })
                .then((user) => {
                  res.redirect(`/users/${req.params.id}`)
                })
              })
          })
        })
      })
    }
    else
      return User.findByPk(req.params.id)
          .then((user) => {
            user.update({
              name: req.body.name,
            })
            .then((user) => {
              res.redirect(`/users/${req.params.id}`)
            })
          })
  },
  getTopUser: (req, res) => {
    return User.findAll({
      include: [
        { model: User, as: 'Follower' },
      ]
    }).then(users => {
      users = users.map(user => ({
        ...user.dataValues, FollowerCount: user.Follower.length,
        isFollowed: req.user.Following.map(d => d.id).includes(user.id),
      }))

      users = users.sort((a,b) => b.FollowerCount - a.FollowerCount)
      return res.render('topUser', { user: req.user, users: users })
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
       return res.redirect('back')
     })
  },
  removeFavorite: (req, res) => {
    return Favorite.findOne({where: {userId: req.user.id, RestaurantId: req.params.restaurantId}})
      .then((favorite) => {
        favorite.destroy()
         .then((restaurant) => {
           return res.redirect('back')
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
       return res.redirect('back')
     })
  },
  removeFollowing: (req, res) => {
    return Followship.findOne({where: {followerId: req.user.id, followingId: req.params.userId}})
      .then((followship) => {
        followship.destroy()
         .then((followship) => {
           return res.redirect('back')
         })
      })
  }
}
module.exports = userController
