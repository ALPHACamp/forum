const passport = require('../config/passport')

const jwt = require('jsonwebtoken');
const passportJWT = require("passport-jwt");
const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;
const bcrypt = require('bcrypt-nodejs')
var jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = 'tasmanianDevil';

var express = require('express');
var router = express.Router();

const db = require('../models')
const User = db.User

const multer = require('multer')
const upload = multer({ dest: 'temp/' })

const adminController = require('../controllers/api/adminController.js')
const restController = require('../controllers/api/restController.js')
const categoryController = require('../controllers/api/categoryController.js')
const commentController = require('../controllers/api/commentController.js')
const userController = require('../controllers/api/userController.js')

router.get('/', passport.authenticate('jwt', {session: false}), (req, res) => res.json({message: 'hello world'}))

router.get('/restaurants', passport.authenticate('jwt', {session: false}), restController.getRestaurants)
router.get('/restaurants/top', passport.authenticate('jwt', {session: false}), restController.getTopRestaurants)
router.get('/restaurants/feeds', passport.authenticate('jwt', {session: false}), restController.getFeeds)
router.get('/restaurants/:id/dashboard', passport.authenticate('jwt', {session: false}), restController.getDashboard)
router.get('/restaurants/:id', passport.authenticate('jwt', {session: false}), restController.getRestaurant)

router.get('/users/top', passport.authenticate('jwt', {session: false}), userController.getTopUser)
router.get('/users/:id', passport.authenticate('jwt', {session: false}), userController.getUser)
router.get('/users/:id/edit', passport.authenticate('jwt', {session: false}), userController.editUser)
router.put('/users/:id', passport.authenticate('jwt', {session: false}), upload.single('image'), userController.putUser)

router.post('/comments', passport.authenticate('jwt', {session: false}), commentController.postComment)
router.delete('/comments/:id', passport.authenticate('jwt', {session: false}), commentController.deleteComment)

router.post('/following/:userId', passport.authenticate('jwt', {session: false}), userController.addFollowing)
router.delete('/following/:userId', passport.authenticate('jwt', {session: false}), userController.removeFollowing)

router.post('/favorite/:restaurantId', passport.authenticate('jwt', {session: false}), userController.addFavorite)
router.delete('/favorite/:restaurantId', passport.authenticate('jwt', {session: false}), userController.removeFavorite)

router.get('/admin/restaurants', passport.authenticate('jwt', {session: false}), adminController.getRestaurants)
router.get('/admin/restaurants/create', passport.authenticate('jwt', {session: false}), adminController.createRestaurant)
router.get('/admin/restaurants/:id/edit', passport.authenticate('jwt', {session: false}), adminController.editRestaurant)
router.get('/admin/restaurants/:id', passport.authenticate('jwt', {session: false}), adminController.getRestaurant)
router.post('/admin/restaurants', passport.authenticate('jwt', {session: false}), upload.single('image'), adminController.postRestaurant)
router.put('/admin/restaurants/:id', passport.authenticate('jwt', {session: false}), upload.single('image'), adminController.putRestaurant)
router.delete('/admin/restaurants/:id', passport.authenticate('jwt', {session: false}), adminController.deleteRestaurant)

router.get('/admin/categories', passport.authenticate('jwt', {session: false}), categoryController.getCategories)
router.get('/admin/categories/:id', passport.authenticate('jwt', {session: false}), categoryController.getCategories)
router.post('/admin/categories', passport.authenticate('jwt', {session: false}), categoryController.postCategory)
router.put('/admin/categories/:id', passport.authenticate('jwt', {session: false}), categoryController.putCategory)
router.delete('/admin/categories/:id', passport.authenticate('jwt', {session: false}), categoryController.deleteCategory)


router.post('/signup', userController.signUp)
router.post("/login", function(req, res) {
 	let username = req.body.username;
	let password = req.body.password;
	// usually this would be a database call:    
	User.findOne({where: {email: username}}).then(user => {
	  if(!user) return res.status(401).json({message:"no such user found"});
	  if (!bcrypt.compareSync(password, user.password)) {
	    return res.status(401).json({message:"passwords did not match"});
	  }
	  var payload = {id: user.id};
	  var token = jwt.sign(payload, jwtOptions.secretOrKey);
	  return res.json({message: "ok", token: token});
	})
});
router.get('/logout', userController.logout)

module.exports = router;

