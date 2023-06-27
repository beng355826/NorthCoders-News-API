const db = require("../db/connection")

exports.selectArticleComments = (articleId) => {

   return db.query(
        `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC `,
        [articleId]

    ).then((comments) => {

    if(comments.rows.length === 0){
        return Promise.reject({
            status : "404 not found"
        })
        }

        return comments.rows
    })


}