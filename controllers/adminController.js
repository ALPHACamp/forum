const fs = require('fs')
const db = require('../models')
const imgur = require('imgur-node-api')
const Restaurant = db.Restaurant
const Category = db.Category

let adminController = {
  getRestaurants: (req, res) => {
    let offset = 0
    if(req.query.page)
     offset = (req.query.page-1) * 5
    
    return Restaurant.findAndCountAll({include: [Category], offset: offset, limit: 5}).then(result => {
      let page = +req.query.page || 1
      let pages = Math.ceil(result.count/5)
      let totalPage = [...Array(pages)].map((_,i) => i+1)
      let prev = page-1 < 1 ? 1 : page-1
      let next = page+1 > pages ? pages : page+1
      return res.render('admin/restaurants', {restaurants: result.rows, user: req.user, isAuthenticated: req.isAuthenticated, 
        page: page, totalPage: totalPage, prev: prev, next: next
      })
    })
  },
  getRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, {include: [Category]}).then(restaurant => {
      return res.render('admin/restaurant', {restaurant: restaurant, user: req.user, isAuthenticated: req.isAuthenticated})
    })
  },
  createRestaurant: (req, res) => {
    Category.findAll().then(categories => {
      return res.render('admin/create', {categories: categories})
    })
  },
  editRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id).then(restaurant => {
      Category.findAll().then(categories => {
        return res.render('admin/create', {categories: categories, restaurant: restaurant, user: req.user, isAuthenticated: req.isAuthenticated})
      })
    })
  },
  postRestaurant: (req, res) => {
    const { file } = req
    console.log(file.originalname)
    if (file) {
      fs.readFile(file.path, (err, data) => {
        if (err) console.log('Error: ', err)
        fs.writeFile(`upload/${file.originalname}`, data, () => {
          imgur.setClientID('5f8cc285e4f2cf5');
          imgur.upload(`upload/${file.originalname}`, (err, img) => {
            return Restaurant.create({
              name: req.body.name,
              tel: req.body.tel,
              address: req.body.address,
              opening_hours: req.body.opening_hours,
              description: req.body.description,
              image: file ? img.data.link : null,
              createdAt: new Date(),
              updatedAt: new Date(),
              CategoryId: req.body.categoryId
            })
             .then((restaurant) => {
               res.redirect('/admin/restaurants')
             })
          })
        })
      })
    }



    
  },
  putRestaurant: (req, res) => {
    const { file } = req
    if (file) {
      fs.readFile(file.path, (err, data) => {
        if (err) console.log('Error: ', err)
        fs.writeFile(`upload/${file.originalname}`, data, () => {
        })
      })
    }


    return Restaurant.findByPk(req.params.id)
      .then((restaurant) => {
        restaurant.updateAttributes({
          name: req.body.name,
          tel: req.body.tel,
          address: req.body.address,
          opening_hours: req.body.opening_hours,
          description: req.body.description,
          image: file ? file.originalname : restaurant.image,
          createdAt: new Date(),
          CategoryId: req.body.categoryId
        })
        .then((restaurant) => {
          res.redirect('/admin/restaurants')
        })
      })
  },
  deleteRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id)
      .then((restaurant) => {
        restaurant.destroy()
          .then((restaurant) => {
            res.redirect('/admin/restaurants')
          })
      })
  }
}
module.exports = adminController
