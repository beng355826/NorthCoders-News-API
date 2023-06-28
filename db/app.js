const express = require("express")
const {getTopics} = require("../controllers/get-api-topics.controller")
const {getControllerApi} = require("../controllers/api-get.controller")
const {getArticles} = require('../controllers/get-articles.controller')
const {postComment} = require('../controllers/post-comment.controller')

const app = express()

app.use(express.json())



app.get('/api/topics', getTopics)
app.get('/api/', getControllerApi )
app.get('/api/articles/:articles_id', getArticles)
app.post('/api/articles/:article_id/comments', postComment)



app.use((err, req, res, next) => {

    if(err.code === '22P02'){
        res.status(400).send({msg: '400 - invalid type request'})
    }
    if(err.code === '23502'){
        res.status(400).send({msg: '400 - not found'})
    }
    next(err)
})

app.use((err,req, res, next) => {
    res.status(404).send({
        msg:'404 - not found'
    })

    next(err)
})



app.use((err, req, res, next) => {
    res.status(500).send({msg: "500 server error"})
})

module.exports = app