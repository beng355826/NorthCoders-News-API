const {selectAllArticles} = require("../models/get-All-Articles.model")

const getAllArticles = (req , res, next) => {

const queryBody = req.query

    return selectAllArticles(queryBody).then((articles) => {
        res.status(200).send({articles})
    }).catch((err) => {
       
        next(err)
    
     })

}


module.exports = {getAllArticles}