const {selectArticleComments, checkIdExists} = require("../models/get-article-comments.model")


const getArticleComments = (req, res, next) => {

    const articleId = req.params.article_id

const promises = [selectArticleComments(articleId)]

if(articleId){
    promises.push(checkIdExists(articleId))
}

return Promise.all(promises)
.then((resolvedPromises) => {


    const comments = resolvedPromises[0]
    res.status(200).send({comments})

}).catch((err) => {

    next(err)

})


}


module.exports = {getArticleComments}


// const getArticleComments = (req, res, next) => {

//     const articleId = req.params.article_id

// return selectArticleComments(articleId).then((comments) => {

//     res.status(200).send({comments})

// }).catch((err) => {

//     next(err)

// })


// }