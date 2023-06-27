const express = require("express")
const {getTopics} = require("../controllers/get-api-topics.controller")
const {getControllerApi} = require("../controllers/api-get.controller")
const {getAllArticles} = require("../controllers/get-All-Articles.controller")


const app = express()

app.get('/api/topics', getTopics)

app.get('/api/', getControllerApi)

app.get('/api/articles', getAllArticles)


module.exports = app