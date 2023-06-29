const {selectUsers} = require("../models/get-users.model")

const getUsers = (req, res, next) => {

    return selectUsers().then((users) => {

        res.status(200).send({users : users})

    })

}


module.exports = {getUsers}