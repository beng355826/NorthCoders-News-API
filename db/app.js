const express = require("express")
const {getTopics} = require("../controllers/get-api-topics.controller")

const {getArticles} = require('../controllers/get-articles.controller')

const app = express()





app.get('/api/topics', getTopics)


app.get('/api/articles/:articles_id', getArticles)

app.use((err, req, res, next) => {

    if(err.code){
        res.status(400).send({msg: '400 - invalid type request'})
    }
    res.status(404).send({
        msg:'404 - not found'
    })

})






module.exports = app