const passport = require('passport')
const LocalStrategy = require('passport-local')
const bcrypt = require('bcrypt-nodejs')
const db = require('../models')
const User = db.User

passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
  },
  function(req, username, password, cb) {
    User.findOne({where: {email: username}}).then(user => {
      if (!user) return cb(null, false)
      if (!bcrypt.compareSync(password, user.password)) return cb(null, false)
      return cb(null, user)
    })
  }
))

passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  User.findByPk(id).then(user => {
    return cb(null, user)
  })
})

module.exports = passport