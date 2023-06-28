const express = require("express")
const {getTopics} = require("../controllers/get-api-topics.controller")
const {getControllerApi} = require("../controllers/api-get.controller")
const {getArticles} = require('../controllers/get-articles.controller')
const app = express()


//challenge 2
app.get('/api/topics', getTopics)

app.get('/api/', getControllerApi )

//challenge 4
app.get('/api/articles/:articles_id', getArticles)


//challenge 5
app.get('')





//error handlers
app.use((err, req, res, next) => {
    if(err.code){
        res.status(400).send({msg: '400 - invalid type request'})
    }
    next(err)
})

app.use((err,req, res, next) => {
    res.status(404).send({
        msg:'404 - not found'
    })
})

module.exports = app