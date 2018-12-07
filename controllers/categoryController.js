const db = require('../models')
const Category = db.Category

let categoryController = {
  getCategories: (req, res) => {
    return Category.findAll().then(categories => {
      if (req.params.id) {
        Category.findByPk(req.params.id)
        .then(function (category) {
          return res.render('admin/categories', {categories: categories, category: category, user: req.user, isAuthenticated: req.isAuthenticated})
        })
      } else {
        return res.render('admin/categories', {categories: categories, user: req.user, isAuthenticated: req.isAuthenticated})
      }
    })
  },
  postCategory: (req, res) => {
    return Category.create({
      name: req.body.name,
      createdAt: new Date(),
      updatedAt: new Date()
    })
     .then(function (category) {
       res.redirect('/admin/categories')
     })
  },
  putCategory: (req, res) => {
    return Category.findByPk(req.params.id)
      .then(function (category) {
        category.updateAttributes(req.body)
        .then(function (category) {
          res.redirect('/admin/categories')
        })
      })
  },
  deleteCategory: (req, res) => {
    return Category.findByPk(req.params.id)
      .then(function (category) {
        category.destroy()
          .then(function (category) {
            res.redirect('/admin/categories')
          })
      })
  }
}
module.exports = categoryController
