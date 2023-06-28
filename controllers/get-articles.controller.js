const db = require("../db/connection")
const {selectArticles} = require('../models/get-articles.model')


const getArticles = (req, res, next) => {
    const param = req.params.articles_id

    return selectArticles(param).then((data) => {
    
        res.status(200).send(data)
    }).catch((err) => {
        next(err)
    })

}

module.exports = {getArticles}