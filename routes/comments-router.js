const { deleteComment } = require('../controllers/delete-comment.controller');

const commentsRouter = require('express').Router();

commentsRouter.delete('/:comment_id', deleteComment)

module.exports = commentsRouter