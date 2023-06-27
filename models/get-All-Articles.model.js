const db = require("../db/connection")
const { commentData } = require("../db/data/test-data")

exports.selectAllArticles = () => {

const comments = db.query(`SELECT *
FROM articles
JOIN comments
ON articles.article_id = comments.article_id`)
const articles = db.query(`SELECT * FROM articles ORDER BY created_at DESC`)

return Promise.all([comments, articles])

.then((array) => {

const comments = array[0].rows
const articles = array[1].rows

   const minusBody = articles.map(article => {
    delete article.body
    article.commentCount = 0
    return article})

for(let i = 0 ; i < comments.length ; i++){
let num = comments[i].article_id  
   for(let j = 0 ; j < articles.length ; j++){
    if(articles[j].article_id === num){
        articles[j].commentCount = articles[j].commentCount + 1
    }
   }
}
    return minusBody
})


}

   




