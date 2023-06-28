const db = require("../db/connection")

exports.insertComment = (articleId, postComment) => {

return db.query(

`INSERT INTO comments
(body,author, article_id) VALUES ($1, $2, $3)
RETURNING *; `,
[postComment.body ,postComment.username, articleId]

).then((comment) => {

return comment.rows[0]

})


}