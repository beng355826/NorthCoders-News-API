const db = require("../db/connection")

exports.selectArticleComments = (articleId) => {

   return db.query(
        `SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC `,
        [articleId]

    ).then((comments) => {
        return comments.rows
    })


}