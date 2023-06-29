const {insertComment} = require("../models/post-comment.model")


const postComment = (req, res, next) => {

    const articleId = req.params.article_id
    const postComment = req.body

   return insertComment(articleId ,postComment).then((comment) => {
    res.status(201).send({comment : comment})

   }).catch((err) => {

    next(err)
   })

}

module.exports = {postComment}