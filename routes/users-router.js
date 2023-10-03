const { getUsers } = require('../controllers/get-users.controller');
const {getSelectedUser} = require('../controllers/get-selected-user.controller')

const usersRouter = require('express').Router();

usersRouter.get('/', getUsers)
usersRouter.get('/:username', getSelectedUser)

module.exports = usersRouter