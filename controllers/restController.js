const Sequelize = require('sequelize');
const db = require('../models')
const Restaurant = db.Restaurant
const Category = db.Category
const Comment = db.Comment
const User = db.User
const Favorite = db.Favorite

let restController = {
  getRestaurants: (req, res) => {
    let offset = 0
    let categoryId = ''
    let whereQuery = {}
    if(req.query.page)
     offset = (req.query.page-1) * 5
    if(req.query.categoryId){
      categoryId = +req.query.categoryId
      whereQuery['categoryId'] = categoryId
    }

    return Restaurant.findAndCountAll({include: [Category], where: whereQuery, offset: offset, limit: 5}).then(result => {
      let page = +req.query.page || 1
      let pages = Math.ceil(result.count/5)
      let totalPage = [...Array(pages)].map((_,i) => i+1)
      let prev = page-1 < 1 ? 1 : page-1
      let next = page+1 > pages ? pages : page+1

      restaurants = result.rows.map(d => ({...d.dataValues, description: d.description.substring(0, 50)}))

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
      attributes: ['id', 'name', 'image', [Sequelize.fn('COUNT', Sequelize.col('favorites.id')), 'FavoriteCount']],
      group: ['Restaurant.id', 'favorites.id'],
    }).then(restaurants => {
      // console.log(restaurants[0].name)
      return res.render('topRestaurants', {
        restaurants: restaurants,
        user: req.user, 
        isAuthenticated: req.isAuthenticated, 
      })
    })
  },
  getRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, {include: [Category, { model: User, as: 'UserFavorite' }, {model: Comment, include: [User]}]}).then(restaurant => {
      return res.render('restaurant', {restaurant: restaurant, user: req.user, isAuthenticated: req.isAuthenticated})
    })
  }
}
module.exports = restController
