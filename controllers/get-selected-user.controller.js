const {fetchSelectedUser} = require('../models/fetch-selected-User.model')

const getSelectedUser =(req, res, next) => {

    const userName = req.params.username
    
   return fetchSelectedUser(userName).then((data) => {
        res.status(200).send(data)
    }).catch((err) => {
        next(err)
    })

   
}

module.exports = {getSelectedUser}