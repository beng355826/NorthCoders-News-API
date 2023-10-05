const {patchCommentMod} = require('../models/patch-comment.model')

const patchCommentCon = (req, res, next) => {

    const commentId = req.params.comment_id
    const increment = req.body.inc_votes

   return patchCommentMod(commentId, increment).then((data) => {

        res.status(200).send(data)

    }).catch((err) => {
       
        next(err)

    })

} 

module.exports = {patchCommentCon}