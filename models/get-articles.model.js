const db = require("../db/connection")


exports.selectArticles = (param) => {

return db.query(
    
    `SELECT * FROM articles 
     WHERE article_id = $1`, [param]

).then((data) => {

    
if(data.rows.length === 0){
    return Promise.reject({
        status : "404 not found"
    })
}

        return data.rows[0]
    })

}
