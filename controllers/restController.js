const Sequelize = require('sequelize');
const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category
const Comment = db.Comment
const User = db.User
const Favorite = db.Favorite
const pageLimit = 10

let restController = {
  getRestaurants: (req, res) => {
    let offset = 0
    let categoryId = ''
    let whereQuery = {}
    if(req.query.page)
     offset = (req.query.page-1) * pageLimit
    if(req.query.categoryId){
      categoryId = +req.query.categoryId
      whereQuery['categoryId'] = categoryId
    }

    return Restaurant.findAndCountAll({include: [Category], where: whereQuery, offset: offset, limit: pageLimit}).then(result => {
      let page = +req.query.page || 1
      let pages = Math.ceil(result.count/pageLimit)
      let totalPage = [...Array(pages)].map((_,i) => i+1)
      let prev = page-1 < 1 ? 1 : page-1
      let next = page+1 > pages ? pages : page+1

      restaurants = result.rows.map(d => (
        {...d.dataValues, 
          description: d.description.substring(0, 50),
          isFavorited: req.user.UserFavorite.map(d => d.id).includes(d.id)
        }
      ))

      Category.findAll().then(categories => {
        return res.render('restaurants', {
          restaurants: restaurants, 
          categories: categories,
          user: req.user, 
          isAuthenticated: req.isAuthenticated, 
          page: page, totalPage: totalPage, prev: prev, next: next,
          categoryId: categoryId
        })
      })
    })
  },
  getTopRestaurants: (req, res) => {
    return Restaurant.findAll({
      include: [Favorite],
      // attributes: ['id', 'name', 'image', 'description', [Sequelize.fn('COUNT', Sequelize.col('Favorites.restaurantId')), 'FavoriteCount']],
      // group: ['Restaurant.id', 'Favorites.id'],
      // order: Sequelize.literal('FavoriteCount DESC')
    }).then(restaurants => {
      // console.log(restaurants[0].name)
      restaurants = restaurants.map(d => (
        {...d.dataValues, 
          description: d.description.substring(0, 50),
          isFavorited: req.user.UserFavorite.map(d => d.id).includes(d.id),
          FavoriteCount: d.Favorites.length,
        }
      ))
      restaurants = restaurants.sort((a, b) => a.FavoriteCount < b.FavoriteCount ? 1 : -1).slice(0, 10)

      return res.render('topRestaurants', {
        restaurants: restaurants,
        user: req.user, 
        isAuthenticated: req.isAuthenticated, 
      })
    })
  },
  getRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, {include: [Category, { model: User, as: 'UserFavorite' }, {model: Comment, include: [User]}]}).then(restaurant => {
      const isFavorited = restaurant.UserFavorite.map(d => d.id).includes(req.user.id)
      return res.render('restaurant', {restaurant: restaurant, isFavorited: isFavorited, user: req.user})
    })
  },
  getDashboard: (req, res) => {
    return Restaurant.findByPk(req.params.id, {include: [Category, { model: User, as: 'UserFavorite' }, {model: Comment, include: [User]}]}).then(restaurant => {
      return res.render('dashboard', {restaurant: restaurant, user: req.user})
    })
  },
  getFeeds: (req, res) => {
    return Restaurant.findAll({limit: 10, order: [['createdAt', 'DESC'],], include: [Category]}).then(restaurants => {
      Comment.findAll({limit: 10, order: [['createdAt', 'DESC'],], include: [User, Restaurant]}).then(comments => {
        return res.render('feeds', {restaurants: restaurants, comments: comments, user: req.user})
      })
    })
  }
}
module.exports = restController
