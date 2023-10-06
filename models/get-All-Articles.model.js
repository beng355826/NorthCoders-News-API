const db = require("../db/connection");

exports.selectAllArticles = (queryBody) => {
  if (queryBody.order) {
    if (!["asc", "desc"].includes(queryBody.order)) {
      return Promise.reject({ status: 400, msg: "Invalid order query" });
    }
  }

  queryBody.limit === undefined ? queryBody.limit = 10 : null
  
  let count = 0;
  const keysArr = ["topic", "sort_by", "order", "limit", "p"];
  Object.keys(queryBody).forEach((key) => {
    if (!keysArr.includes(key)) {
      count++;
    }
  });

  if (count > 0) {
    return Promise.reject({ msg: "400 query does not exist" });
  }

let queryStr;
  queryStr = `SELECT COUNT(comments.article_id)::INT
AS comment_count, articles.article_id, articles.author, articles.title, topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(*) OVER() AS total_rows 
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
    queryStr += ` DESC`;
  } else {
    queryStr += " ASC";
  }

  if (queryBody.limit && queryBody.p) {
    queryStr += ` LIMIT ${queryBody.limit} OFFSET ${
      queryBody.limit * queryBody.p - queryBody.limit
    }`;
  }

  queryStr += `;`;

  return db.query(queryStr).then((data) => {

if(data.rows.length !== 0){

  const totalCount = parseInt(data.rows[0].total_rows)
  const removedTotalRows = data.rows.map((article) => {
       delete article.total_rows;
       return article
  })
    const sendIt = { total_count: totalCount, articles: removedTotalRows };
    return sendIt;

} else {


  const sendIt = { total_count: 0, articles: data.rows };
  return sendIt
}

  
  });
};
