const { selectArticles } = require('../models/get-articles.model')
const {postArticleMod} = require('../models/post-article.model')

const postArticleCon = (req, res, next) => {

    const body = req.body

   return postArticleMod(body).then((data) => {

        selectArticles(data).then((data) => {
            res.status(201).send(data)
        })

   }).catch((err) => {
    
    next(err)
   })

}

module.exports = {postArticleCon}