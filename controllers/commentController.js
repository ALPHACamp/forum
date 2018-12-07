const db = require('../models')
const Restaurant = db.Restaurant
const Comment = db.Comment

let commentController = {
  postComment: (req, res) => {
    return Comment.create({
      text: req.body.text,
      createdAt: new Date(),
      updatedAt: new Date(),
      RestaurantId: req.body.restaurantId,
      UserId: req.user.id
    })
    .then(function (restaurant) {
      res.redirect(`/restaurants/${req.body.restaurantId}`)
    })
  },
  deleteComment: (req, res) => {
    return Comment.findByPk(req.params.id, {include: [Restaurant]})
      .then(function (comment) {
        comment.destroy()
          .then(function (comment) {
            res.redirect(`/restaurants/${comment.dataValues.RestaurantId}`)
          })
      })
  }
}
module.exports = commentController
