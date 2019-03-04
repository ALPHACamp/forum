const fs = require('fs')
const db = require('../models')
const imgur = require('imgur-node-api')
const Restaurant = db.Restaurant
const Category = db.Category
const pageLimit = 10

let adminController = {
  getRestaurants: (req, res) => {
    let offset = 0
    if(req.query.page)
      offset = (req.query.page-1) * pageLimit

    return Restaurant.findAndCountAll({include: [Category], offset: offset, limit: pageLimit}).then(result => {
      let page = +req.query.page || 1
      let pages = Math.ceil(result.count/pageLimit)
      let totalPage = [...Array(pages)].map((_,i) => i+1)
      let prev = page-1 < 1 ? 1 : page-1
      let next = page+1 > pages ? pages : page+1
      return res.render('admin/restaurants', {
        restaurants: result.rows, 
        user: req.user, 
        page: page, totalPage: totalPage, prev: prev, next: next
      })
    })
  },
  getRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, {include: [Category]}).then(restaurant => {
      return res.render('admin/restaurant', {
        restaurant: restaurant,
        user: req.user
      })
    })
  },
  createRestaurant: (req, res) => {
    Category.findAll().then(categories => {
      return res.render('admin/create', {
        categories: categories,
        user: req.user
      })
    })
  },
  editRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id).then(restaurant => {
      Category.findAll().then(categories => {
        return res.render('admin/create', {
          categories: categories,
          restaurant: restaurant, 
          user: req.user
        })
      })
    })
  },
  postRestaurant: (req, res) => {

    if(!req.body.name){
      req.flash('error_messages', 'name didn’t exist')
      return res.redirect('back')
    }

    const { file } = req
    if (file) {
      fs.readFile(file.path, (err, data) => {
        if (err) console.log('Error: ', err)
        fs.writeFile(`upload/${file.originalname}`, data, () => {
          imgur.setClientID('');
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
            }).then((restaurant) => {
              req.flash('success_messages', 'restaurant was successfully created')
              return res.redirect('/admin/restaurants')
            })
          })
        })
      })
    }
    else {
      return Restaurant.create({
        name: req.body.name,
        tel: req.body.tel,
        address: req.body.address,
        opening_hours: req.body.opening_hours,
        description: req.body.description,
        image: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        CategoryId: req.body.categoryId
      }).then((restaurant) => {
        req.flash('success_messages', 'restaurant was successfully created')
        return res.redirect('/admin/restaurants')
      })
     }
  },
  putRestaurant: (req, res) => {
    if(!req.body.name){
      req.flash('error_messages', 'name didn’t exist')
      return res.redirect('back')
    }

    const { file } = req
    if (file) {
      fs.readFile(file.path, (err, data) => {
        if (err) console.log('Error: ', err)
        fs.writeFile(`upload/${file.originalname}`, data, () => {
          imgur.setClientID('');
          imgur.upload(`upload/${file.originalname}`, (err, img) => {
            return Restaurant.findByPk(req.params.id)
              .then((restaurant) => {
                restaurant.updateAttributes({
                  name: req.body.name,
                  tel: req.body.tel,
                  address: req.body.address,
                  opening_hours: req.body.opening_hours,
                  description: req.body.description,
                  image: file ? img.data.link : restaurant.image,
                  createdAt: new Date(),
                  CategoryId: req.body.categoryId
                })
                .then((restaurant) => {
                  req.flash('success_messages', 'restaurant was successfully to update')
                  res.redirect('/admin/restaurants')
                })
              })
          })
        })
      })
    }
    else
      return Restaurant.findByPk(req.params.id)
        .then((restaurant) => {
          restaurant.updateAttributes({
            name: req.body.name,
            tel: req.body.tel,
            address: req.body.address,
            opening_hours: req.body.opening_hours,
            description: req.body.description,
            image: restaurant.image,
            createdAt: new Date(),
            CategoryId: req.body.categoryId
          })
          .then((restaurant) => {
            req.flash('success_messages', 'restaurant was successfully to update')
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
