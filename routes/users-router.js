const { getUsers } = require('../controllers/get-users.controller');

const usersRouter = require('express').Router();

usersRouter.get('/', getUsers)

module.exports = usersRouter