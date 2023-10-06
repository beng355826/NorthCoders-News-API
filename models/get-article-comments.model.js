const db = require("../db/connection")

exports.selectArticleComments = (articleId, limit, p, queryBody) => {

    
    let count = 0;
    const keysArr = ['articleId', "limit", "p"];
    Object.keys(queryBody).forEach((key) => {
      if (!keysArr.includes(key)) {
        count++;
      }
    });
  
    if (count > 0) {
      return Promise.reject({ msg: "400 query does not exist" });
    }


limit === undefined ? limit = 10 : null
let queryStr = ''

if(limit && p){
    
   queryStr+= `SELECT * FROM comments WHERE article_id = ${articleId} ORDER BY created_at DESC LIMIT ${limit} OFFSET ${
        (limit * p) - limit};`
} else  {
  queryStr +=  `SELECT * FROM comments WHERE article_id = ${articleId} ORDER BY created_at DESC;`
}

    return db.query(
       queryStr
    ).then((comments) => {
        return comments.rows
    })

}


exports.checkIdExists = (articleId) => {

    return db.query(
        `SELECT * FROM articles WHERE article_id = $1`,
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