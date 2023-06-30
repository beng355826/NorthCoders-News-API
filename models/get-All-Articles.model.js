const db = require("../db/connection")


exports.selectAllArticles = (queryBody) => {

const commentsQuery = db.query(`SELECT *
FROM articles
JOIN comments
ON articles.article_id = comments.article_id`)


let queryStr
const queryValues = []
queryStr = `SELECT article_id, title, topic, author, created_at, votes, article_img_url FROM articles`;


if (queryBody.topic) {
  queryValues.push(queryBody.topic)
  queryStr += ` WHERE topic = $${queryValues.length}`
}

if (queryBody.sort_by) {
    queryValues.push(queryBody.sort_by)
    queryStr += ` ORDER BY $${queryValues.length}`;
  } else {
    queryStr += ` ORDER BY created_at `
  }
console.log(queryBody.order)
  if(!queryBody.order || queryBody.order === 'desc'){
    queryStr += ` DESC;`
  } else {
    queryStr += ' ASC;'
  }


//console.log(queryValues)

const articlesQuery = db.query(queryStr, queryValues)

return Promise.all([commentsQuery, articlesQuery])
.then((promiseArray) => {

//console.log(promiseArray[1].rows)
const comments = promiseArray[0].rows
const articles = promiseArray[1].rows

const addCommentCount = articles.map(article => {
    article.commentCount = 0
    return article})

    for(let i = 0 ; i < comments.length ; i++){
        let num = comments[i].article_id  
           for(let j = 0 ; j < articles.length ; j++){
            if(articles[j].article_id === num){
                articles[j].commentCount = articles[j].commentCount + 1
             }}}
            return addCommentCount
    

})

}






// if(!queryBody.topic){

//     articlesQuery = db.query(articlesQueryString.concat(" ORDER BY created_at DESC;"))
// }
// //console.log(articlesQueryString.concat(" ORDER BY created_at DESC;"))
// if((queryBody.topic)){
// queryValues.push(queryBody.topic)
// articlesQueryString += ` WHERE topic = $1`;
    
// }

// if (queryBody.sort_by) {
//     if (queryValues.length) {
//     queryValues.push(queryBody.sort_by)
//       articlesQueryString += ` ORDER BY $${queryValues.length}`;
//     } else {
//       articlesQueryString += ` ORDER BY $1`;
//     }

//     if(!queryBody.order){
//         articlesQueryString += ` ORDER BY created_at DESC;`
//     } else {
//         articlesQueryString += ` ASC;`
//     }

//     articlesQuery = db.query(articlesQueryString, queryValues)

// }









   
