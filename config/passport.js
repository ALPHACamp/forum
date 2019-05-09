const passport = require('passport')
const LocalStrategy = require('passport-local')
const jwt = require('jsonwebtoken');
const passportJWT = require("passport-jwt");
const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;
const bcrypt = require('bcrypt-nodejs')
const db = require('../models')
const User = db.User

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
},
  (req, username, password, cb) => {
    User.findOne({where: {email: username}}).then(user => {
      if (!user) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤'))
      if (!bcrypt.compareSync(password, user.password)) return cb(null, false, req.flash('error_messages', '帳號或密碼輸入錯誤！'))
      return cb(null, user)
    })
  }
))

var jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = 'tasmanianDevil';

var strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
  console.log('payload received', jwt_payload);
  // usually this would be a database call:
  User.findByPk(jwt_payload.id, {
      include: [
        { model: db.Restaurant, as: 'UserFavorite' },
        { model: User, as: 'Follower' },
        { model: User, as: 'Following' }
      ]
    }).then(user => {
      if (!user) return next(null, false);
      console.log(user)
      return next(null, user)
   })
});

passport.use(strategy);

passport.serializeUser((user, cb) => {
  cb(null, user.id)
})

passport.deserializeUser((id, cb) => {
  User.findByPk(id, {
      include: [
        { model: db.Restaurant, as: 'UserFavorite' },
        { model: User, as: 'Follower' },
        { model: User, as: 'Following' }
      ]
    }).then(user => {
      return cb(null, user)
    })
})

module.exports = passport
