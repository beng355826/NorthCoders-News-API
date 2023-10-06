const { getTopics } = require('../controllers/get-api-topics.controller');
const { postTopicsCon } = require('../controllers/post-topics.controller');

const topicsRouter = require('express').Router();

topicsRouter.get('/', getTopics)
topicsRouter.post('/', postTopicsCon)

module.exports = topicsRouter