const db = require("../db/connection")
const {getApi} = require("../models/api-get.model")

const getControllerApi = (req, res) => {


    return getApi().then((data) => {
        res.status(200).send(data)
    })

}

module.exports = {getControllerApi}