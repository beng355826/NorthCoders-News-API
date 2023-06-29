const express = require("express")
const {getTopics} = require("../controllers/get-api-topics.controller")
const {getControllerApi} = require("../controllers/api-get.controller")
const {getArticles} = require('../controllers/get-articles.controller')
const {postComment} = require('../controllers/post-comment.controller')
const {error400Handler, error404Handler, error500Handler} = require('./errorHandlers')

const app = express()
app.use(express.json())


app.get('/api/topics', getTopics)
app.get('/api/', getControllerApi )
app.get('/api/articles/:articles_id', getArticles)
app.post('/api/articles/:article_id/comments', postComment)



app.use(error400Handler)
app.use(error404Handler)
app.use(error500Handler)





module.exports = app