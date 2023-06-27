const {selectArticleComments} = require("../models/get-article-comments.model")


const getArticleComments = (req, res, next) => {

    const articleId = req.params.article_id

return selectArticleComments(articleId).then((comments) => {

    res.status(200).send({comments})

}).catch((err) => {

    next(err)

})


}



module.exports = {getArticleComments}