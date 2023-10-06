const {selectAllArticles} = require("../models/get-All-Articles.model")

const getAllArticles = (req , res, next) => {

const queryBody = req.query

    return selectAllArticles(queryBody).then((articles) => {

        if(articles.articles.length === 0){
            queryBody.p = 1
            selectAllArticles(queryBody).then((articles) => {
                articles.articles = []
                res.status(200).send(articles)
            })
        } else {
            res.status(200).send(articles)
        }

    }).catch((err) => {
        
        next(err)
    
     })

}


module.exports = {getAllArticles}