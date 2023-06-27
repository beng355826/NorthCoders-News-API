const db = require("../db/connection")

exports.selectAllArticles = () => {

   return db.query(

    `SELECT * FROM articles;`

    ).then((data) => {

        
        return data.rows

    })

}