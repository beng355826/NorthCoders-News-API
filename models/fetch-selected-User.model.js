const db = require('../db/connection')

exports.fetchSelectedUser = (userName) => {


    return db.query(

        `SELECT * FROM users WHERE users.username = $1;`, [userName]

    ).then(({rows}) => {
        
       if(rows.length === 0){
        return Promise.reject({status : "404 not found"})
       } else {
        return rows[0]
       }
        
    })

}


