const db = require("../db/connection")
const {selectAllArticles} = require("../models/get-All-Articles.model")

const getAllArticles = (req , res) => {

    return selectAllArticles().then((data) => {

        res.status(200).send(data)
    })

}


module.exports = {getAllArticles}