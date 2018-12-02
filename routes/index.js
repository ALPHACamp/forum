const bcrypt = require('bcrypt-nodejs')
const db = require('../models')
const User = db.User

module.exports = function (app, passport) {

  function authenticated (req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
    res.redirect('/signin')
  }

  function authenticatedAdmin (req, res, next) {
    if (req.isAuthenticated()) {
      if(req.user.role)
        return next()
      return res.redirect('/')
    }
    res.redirect('/signin')
  }

  app.get('/', authenticated, (req, res) => res.render('index'))
  app.get('/admin', authenticatedAdmin, (req, res) => res.render('admin'))

  app.get('/signin', (req, res) => res.render('signin'))
  app.post('/signin', 
    passport.authenticate('local', { failureRedirect: '/signin',}),
    function(req, res) {
      res.redirect('/')
    }
  )
  app.get('/signup', (req, res) => {
    return res.render('signup')
  })
  app.post('/signup', (req, res) => {
    User.create({
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
};