const {deleteCommentFromDb} = require("../models/delete-comment.model")

const deleteComment = (req, res, next) => {

    const commentId = req.params.comment_id

return deleteCommentFromDb(commentId).then((deletedCom) => {

res.sendStatus(204)

}).catch((err) => {
    next(err)
})

}

module.exports = {deleteComment}