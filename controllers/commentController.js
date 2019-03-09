const db = require('../models')
const Restaurant = db.Restaurant
const Comment = db.Comment

let commentController = {
  postComment: (req, res) => {
    return Comment.create({
      text: req.body.text,
      RestaurantId: req.body.restaurantId,
      UserId: req.user.id
    })
    .then((restaurant) => {
      res.redirect(`/restaurants/${req.body.restaurantId}`)
    })
  },
  deleteComment: (req, res) => {
    return Comment.findByPk(req.params.id, {include: [Restaurant]})
      .then((comment) => {
        comment.destroy()
          .then((comment) => {
            res.redirect(`/restaurants/${comment.dataValues.RestaurantId}`)
          })
      })
  }
}
module.exports = commentController
