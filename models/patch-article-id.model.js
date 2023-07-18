const db = require("../db/connection")

exports.updateArticleId = (articleId, patch) => {

return db.query(

    `UPDATE articles SET votes = votes + $1
    WHERE article_id = $2 RETURNING *; `,

    [patch,articleId]

).then((article) => {

    if(article.rows[0].length === 0){
        return Promise.reject
    }

   return article.rows[0]

})

}