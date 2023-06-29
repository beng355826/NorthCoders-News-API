const express = require("express")
const {getTopics} = require("../controllers/get-api-topics.controller")
const {getControllerApi} = require("../controllers/api-get.controller")
const {getArticles} = require('../controllers/get-articles.controller')
const {postComment} = require('../controllers/post-comment.controller')
const {getArticleComments} = require('../controllers/get-article-comments.controller')
const { getAllArticles } = require("../controllers/get-All-Articles.controller")
const {deleteComment} = require("../controllers/delete-comment.controller")
const {patchArticleId} = require("../controllers/patch-article-id.controller")
const { error400Handler, error404Handler, error500Handler } = require("./errorHandlers")

const app = express()
app.use(express.json())



app.get('/api/topics', getTopics)
app.get('/api/', getControllerApi )
app.get('/api/articles/:articles_id', getArticles)
app.get('/api/articles', getAllArticles )
app.get('/api/articles/:article_id/comments', getArticleComments)
app.post('/api/articles/:article_id/comments', postComment)
app.patch('/api/articles/:article_id', patchArticleId)
app.delete('/api/comments/:comment_id', deleteComment)

app.use(error400Handler)
app.use(error404Handler)
app.use(error500Handler)


module.exports = app

