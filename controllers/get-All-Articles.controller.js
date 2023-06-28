const db = require("../db/connection")
const {selectAllArticles} = require("../models/get-All-Articles.model")

const getAllArticles = (req , res) => {

    return selectAllArticles().then((articles) => {
        res.status(200).send({articles})
    })

}


module.exports = {getAllArticles}