const db = require('../models')
const Category = db.Category

let categoryController = {
  getCategories: (req, res) => {
    return Category.findAll().then(categories => {
      if (req.params.id) {
        Category.findByPk(req.params.id)
        .then((category) => {
          return res.render('admin/categories', {categories: categories, category: category, user: req.user})
        })
      } else {
        return res.render('admin/categories', {categories: categories, user: req.user})
      }
    })
  },
  postCategory: (req, res) => {
    if(!req.body.name){
      req.flash('error_messages', 'name didn’t exist')
      return res.redirect('back')
    } else {
      return Category.create({
        name: req.body.name,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .then((category) => {
        res.redirect('/admin/categories')
      })
    }
  },
  putCategory: (req, res) => {
    if(!req.body.name){
      req.flash('error_messages', 'name didn’t exist')
      return res.redirect('back')
    } else {
      return Category.findByPk(req.params.id)
        .then((category) => {
          category.updateAttributes(req.body)
          .then((category) => {
            res.redirect('/admin/categories')
          })
        })
    }
  },
  deleteCategory: (req, res) => {
    return Category.findByPk(req.params.id)
      .then((category) => {
        category.destroy()
          .then((category) => {
            res.redirect('/admin/categories')
          })
      })
  }
}
module.exports = categoryController
