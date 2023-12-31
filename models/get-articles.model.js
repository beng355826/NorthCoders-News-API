const db = require("../db/connection")


exports.selectArticles = (param) => {

return db.query(
    
    `SELECT articles.*, SUM(comments.article_id)::INT AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id
    WHERE articles.article_id = $1 GROUP BY articles.article_id;
`, [param]

).then((data) => {

if(data.rows[0].comment_count === null){data.rows[0].comment_count = 0}

if(data.rows.length === 0){
    return Promise.reject({
        status : "404 not found"
    })
}

        return data.rows[0]
    })

}
