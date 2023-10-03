const express = require("express")
const { error400Handler, error404Handler, error500Handler } = require("./errorHandlers")
const cors = require('cors')
const app = express()

const apiRouter = require('./routes/api-router')
const articlesRouter = require('./routes/articles-router')
const topicsRouter = require("./routes/topics-router")
const commentsRouter = require('./routes/comments-router')
const usersRouter = require("./routes/users-router")



app.use(cors());
app.use(express.json())
app.use('/api', apiRouter)
app.use('/api/articles', articlesRouter)
app.use('/api/topics', topicsRouter)
app.use('/api/comments', commentsRouter)
app.use('/api/users', usersRouter)


app.use(error400Handler)
app.use(error404Handler)
app.use(error500Handler)


module.exports = app

