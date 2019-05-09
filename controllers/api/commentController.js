const db = require('../../models')
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
      return res.json({ status: 'success', message: ''})
    })
  },
  deleteComment: (req, res) => {
    return Comment.findByPk(req.params.id, {include: [Restaurant]})
      .then((comment) => {
        comment.destroy()
          .then((comment) => {
            return res.json({ status: 'success', message: ''})
          })
      })
  }
}
module.exports = commentController
