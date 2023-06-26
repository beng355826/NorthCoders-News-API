const express = require("express")
const {getTopics} = require("../controllers/get-api-topics.controller")
const {getControllerApi} = require("../controllers/api-get.controller")


const app = express()
app.get('/api/topics', getTopics)

app.get('/api/', getControllerApi )


module.exports = app