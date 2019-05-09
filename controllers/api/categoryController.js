const db = require('../../models')
const Category = db.Category

let categoryController = {
  getCategories: (req, res) => {
    return Category.findAll().then(categories => {
      if (req.params.id) {
        Category.findByPk(req.params.id)
        .then((category) => {
          return res.json({categories: categories, category: category})
        })
      } else {
        return res.json({categories: categories})
      }
    })
  },
  postCategory: (req, res) => {
    if(!req.body.name){
      return res.json({ status: 'error', message: 'name didn’t exist'})
    } else {
      return Category.create({
        name: req.body.name
      })
      .then((category) => {
        return res.json({ status: 'success', message: ''})
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
            return res.json({ status: 'success', message: ''})
          })
        })
    }
  },
  deleteCategory: (req, res) => {
    return Category.findByPk(req.params.id)
      .then((category) => {
        category.destroy()
          .then((category) => {
            return res.json({ status: 'success', message: ''})
          })
      })
  }
}
module.exports = categoryController
