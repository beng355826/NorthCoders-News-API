const db = require("../db/connection")

exports.deleteCommentFromDb = (commentId) => {

   return db.query(

    `DELETE FROM comments WHERE comment_id = $1
    RETURNING * ;`,
    [commentId]

   ).then((deletedCom) => {
    
if(deletedCom.rows.length === 0){

    return Promise.reject({
        status : "404 not found"
    })

}

    return deletedCom.rows


   })


}