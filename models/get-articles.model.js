const db = require("../db/connection")
const format = require('pg-format')


exports.selectArticles = (param) => {

const query = format(
`SELECT * FROM articles 
WHERE article_id = %L;`,
param
)

return db.query(query).then((data) => {

    
if(data.rows.length === 0){
    return Promise.reject({
        status : "404 not found"
    })
}

        return data.rows[0]
    })

}
