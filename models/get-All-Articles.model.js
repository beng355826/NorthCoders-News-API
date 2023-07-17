const db = require("../db/connection");

exports.selectAllArticles = (queryBody) => {
  if (queryBody.order) {
    if (!["asc", "desc"].includes(queryBody.order)) {
      return Promise.reject({ status: 400, msg: "Invalid order query" });
    }
  }

  let count = 0;
  const keysArr = ["topic", "sort_by", "order"];
  Object.keys(queryBody).forEach((key) => {
    if (!keysArr.includes(key)) {
      count++;
    }
  });

  if (count > 0) {
    return Promise.reject({msg : '400 query does not exist' });
  }

  // if(!['topic', 'sort_by', 'order'].includes(queryBody.order)){

  // }

  // if(queryBody.order){

  //   if(query.body !== 'desc'){

  //     if(query.body !== 'asc'){
  //       Promise.reject()
  //     }}

  //   }

  let queryStr;
  const queryValues = [];
  queryStr = `SELECT COUNT(comments.article_id)::INT
AS comment_count, articles.article_id, articles.author, articles.title, topic, articles.created_at, articles.votes, articles.article_img_url 
FROM articles LEFT JOIN comments 
ON articles.article_id = comments.article_id`;

  if (queryBody.topic) {
    queryStr += ` WHERE topic = '${queryBody.topic}'`;
  }

  if (queryBody.sort_by) {
    queryStr += ` GROUP BY articles.article_id ORDER BY ${queryBody.sort_by}`;
  } else {
    queryStr += ` GROUP BY articles.article_id ORDER BY articles.created_at`;
  }

  if (!queryBody.order || queryBody.order === "desc") {
    queryStr += ` DESC;`;
  } else {
    queryStr += " ASC;";
  }
  //console.log(queryStr)
  return db.query(queryStr).then((query) => {
    return query.rows;
  });
};

// const addCommentCount = articles.map(article => {
//     article.commentCount = 0
//     return article})

//     for(let i = 0 ; i < comments.length ; i++){
//         let num = comments[i].article_id
//            for(let j = 0 ; j < articles.length ; j++){
//             if(articles[j].article_id === num){
//                 articles[j].commentCount = articles[j].commentCount + 1
//              }}}
//             return addCommentCount

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

//const commentsQuery = db.query(

//   `SELECT COUNT(comments.article_id) AS comment_count, articles.article_id, articles.author, articles.title, topic, articles.created_at, articles.votes, articles.article_img_url
//   FROM articles LEFT JOIN comments
//   ON articles.article_id = comments.article_id
//   GROUP BY articles.article_id ORDER BY articles.created_at DESC`)
