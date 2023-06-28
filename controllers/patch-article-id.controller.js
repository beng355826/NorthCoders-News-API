
const {updateArticleId} = require('../models/patch-article-id.model')

const patchArticleId = (req, res, next) => {

const articleId = req.params.article_id
const incrementVotes = req.body.inc_votes

return updateArticleId(articleId, incrementVotes).then((article) => {

    res.status(200).send(article)

}).catch((err) => {
console.log(err)
    next(err)

})

}

module.exports = {patchArticleId}