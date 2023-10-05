const { deleteComment } = require('../controllers/delete-comment.controller');
const { patchCommentCon } = require('../controllers/patch-comment.controller')

const commentsRouter = require('express').Router();

commentsRouter.delete('/:comment_id', deleteComment)
commentsRouter.patch('/:comment_id', patchCommentCon)

module.exports = commentsRouter