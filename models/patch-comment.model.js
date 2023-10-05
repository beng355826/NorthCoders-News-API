const db = require('../db/connection')

const patchCommentMod = (commentId, increment) => {

return db.query(

    `UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *;`, [increment,commentId]

).then((data) => {
console.log(data.rows);
    if(data.rows.length === 0){
        return Promise.reject
    } else {
        return data.rows[0]
    }

    
})

}

module.exports = {patchCommentMod}