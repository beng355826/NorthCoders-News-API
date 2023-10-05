const db = require('../db/connection')
const postArticleMod = (body) => {

    if(body.article_img_url === null){body.article_img_url = 'https://static.vecteezy.com/system/resources/thumbnails/002/206/011/small/article-icon-free-vector.jpg'}

   return db.query(

        `
        INSERT INTO articles
        (author, title, body, topic, article_img_url) VALUES ($1, $2, $3, $4, $5)
        RETURNING *;

        `, [body.author, body.title, body.body, body.topic, body.article_img_url]



    ).then((data) => {

       return data.rows[0].article_id
    })
   
}

module.exports = {postArticleMod}
