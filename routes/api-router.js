const apiRouter = require('express').Router();
const { getControllerApi } = require('../controllers/api-get.controller');

apiRouter.get('/', getControllerApi)

module.exports = apiRouter