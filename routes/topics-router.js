const { getTopics } = require('../controllers/get-api-topics.controller');

const topicsRouter = require('express').Router();

topicsRouter.get('/', getTopics)

module.exports = topicsRouter