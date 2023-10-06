const db = require('../db/connection')

const postTopicsMod = (body) => {
console.log(body.description);
if(!body.description || !body.slug){
    console.log('hello');
    return Promise.reject
} 


    return db.query(

        `INSERT INTO topics
        (slug, description) VALUES ($1 , $2)
        RETURNING *;`,
        [body.slug , body.description]

    ).then((data) => {
       
        return data.rows[0];
    })


}

module.exports = {postTopicsMod}