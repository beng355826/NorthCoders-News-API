const express = require("express")
const {getTopics} = require("../controllers/get-api-topics.controller")
const {getControllerApi} = require("../controllers/api-get.controller")
const {getArticles} = require('../controllers/get-articles.controller')
const {getArticleComments} = require('../controllers/get-article-comments.controller')
const { getAllArticles } = require("../controllers/get-All-Articles.controller")
const {deleteComment} = require("../controllers/delete-comment.controller")

const app = express()
app.use(express.json())

app.get('/api/topics', getTopics)
app.get('/api/', getControllerApi )
app.get('/api/articles/:articles_id', getArticles)
app.get('/api/articles', getAllArticles )
app.get('/api/articles/:article_id/comments', getArticleComments)

app.delete('/api/comments/:comment_id', deleteComment)





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