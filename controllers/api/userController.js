const bcrypt = require('bcrypt-nodejs')
const fs = require('fs')
const imgur = require('imgur-node-api')
const db = require('../../models')
const User = db.User
const Restaurant = db.Restaurant
const Favorite = db.Favorite
const Followship = db.Followship
const Comment = db.Comment

let userController = {
  signUp: (req, res) => {

    console.log(req.body)

    if(!req.body.email || !req.body.password)
      return res.json({ status: 'error', message: '請輸入資料'})

    if(req.body.passwordCheck !== req.body.password){
      return res.json({ message: '兩次密碼輸入不同！', status: 'error' })
    } else {
      User.findOne({where: {email: req.body.email}}).then(user => {
        if(user){
          return res.json({ message: '信箱重複！', status: 'error' })
        } else {
          User.create({
            name: req.body.name,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
          }).then(user => {
            return res.json({ message: '成功註冊帳號！', status: 'success' })
          })  
        }
      })    
    }
  },

  // logout: (req, res) => {
  //   req.flash('success_messages', '登出成功！')
  //   req.logout()
  //   res.redirect('/signin')
  // },

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
      return res.json({ profile: user, isFollowed: isFollowed })
    })
  },
  editUser: (req, res) => {
    return User.findByPk(req.params.id).then(user => {
      return res.json({user: user})
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
                  return res.json({ status: 'success', message: ''})
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
              return res.json({ status: 'success', message: ''})
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
      return res.json({ users: users })
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
       return res.json({ status: 'success', message: ''})
     })
  },
  removeFavorite: (req, res) => {
    return Favorite.findOne({where: {userId: req.user.id, RestaurantId: req.params.restaurantId}})
      .then((favorite) => {
        favorite.destroy()
         .then((restaurant) => {
           return res.json({ status: 'success', message: ''})
         })
      })
  },
  addFollowing: (req, res) => {
    return Followship.create({
      followerId: req.user.id,
      followingId: req.params.userId
    })
     .then((followship) => {
       return res.json({ status: 'success', message: ''})
     })
  },
  removeFollowing: (req, res) => {
    return Followship.findOne({where: {followerId: req.user.id, followingId: req.params.userId}})
      .then((followship) => {
        followship.destroy()
         .then((followship) => {
           return res.json({ status: 'success', message: ''})
         })
      })
  }
}
module.exports = userController
