const bcrypt = require('bcrypt-nodejs')
const adminController = require('../controllers/adminController.js')
const restController = require('../controllers/restController.js')
const categoryController = require('../controllers/categoryController.js')
const commentController = require('../controllers/commentController.js')
const userController = require('../controllers/userController.js')
const db = require('../models')
const User = db.User

var multer = require('multer')
var upload = multer({ dest: 'upload/' })

module.exports = (app, passport) => {
  const authenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next()
    }
    res.redirect('/signin')
  }

  const authenticatedAdmin = (req, res, next) => {
    if (req.isAuthenticated()) {
      if (req.user.isAdmin) { return next() }
      return res.redirect('/')
    }
    res.redirect('/signin')
  }

  // app.get('/', (req, res) => res.redirect('/restaurants'))
  app.get('/', authenticated, (req, res) => res.redirect('/restaurants'))
  app.get('/profile/:id', authenticated, userController.getUser)
  app.post('/following/:userId', authenticated, userController.addFollowing)
  app.delete('/following/:userId', authenticated, userController.removeFollowing)

  app.post('/favorite/:restaurantId', authenticated, userController.addFavorite)
  app.delete('/favorite/:restaurantId', authenticated, userController.removeFavorite)
  app.get('/restaurants', authenticated, restController.getRestaurants)
  app.get('/restaurants/top', authenticated, restController.getTopRestaurants)
  app.get('/restaurants/:id', authenticated, restController.getRestaurant)

  app.get('/users/top', authenticated, userController.getTopUser)

  app.post('/comments', authenticated, commentController.postComment)
  app.delete('/comments/:id', authenticatedAdmin, commentController.deleteComment)

  app.get('/admin', authenticatedAdmin, (req, res) => res.redirect('/admin/restaurants'))
  app.get('/admin/restaurants', authenticatedAdmin, adminController.getRestaurants)
  app.get('/admin/restaurants/create', authenticatedAdmin, adminController.createRestaurant)
  app.get('/admin/restaurants/:id/edit', authenticatedAdmin, adminController.editRestaurant)
  app.get('/admin/restaurants/:id', authenticatedAdmin, adminController.getRestaurant)
  app.post('/admin/restaurants', authenticatedAdmin, upload.single('image'), adminController.postRestaurant)
  app.put('/admin/restaurants/:id', authenticatedAdmin, upload.single('image'), adminController.putRestaurant)
  app.delete('/admin/restaurants/:id', authenticatedAdmin, adminController.deleteRestaurant)

  app.get('/admin/categories', authenticatedAdmin, categoryController.getCategories)
  app.get('/admin/categories/:id', authenticatedAdmin, categoryController.getCategories)
  app.post('/admin/categories', authenticatedAdmin, categoryController.postCategory)
  app.put('/admin/categories/:id', authenticatedAdmin, categoryController.putCategory)
  app.delete('/admin/categories/:id', authenticatedAdmin, categoryController.deleteCategory)

  app.get('/signin', (req, res) => res.render('signin'))
  app.post('/signin',
    passport.authenticate('local', { failureRedirect: '/signin' }),
    (req, res) => {
      res.redirect('/')
    }
  )
  app.get('/signup', (req, res) => {
    return res.render('signup')
  })
  app.post('/signup', (req, res) => {
    User.create({
      name: req.body.name,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10), null)
    }).then(user => {
      return res.redirect('/signin')
    })
  })
  app.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/signin')
  })
}
