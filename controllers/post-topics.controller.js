const {postTopicsMod} = require('../models/post-topics.model')

const postTopicsCon = (req, res, next) => {
   return postTopicsMod(req.body).then((topic) => {
    res.status(201).send(topic)
   }).catch((err) => {

    next(err)

   })

}

module.exports = {postTopicsCon}