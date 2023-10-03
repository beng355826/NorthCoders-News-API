const { getAllArticles } = require('../controllers/get-All-Articles.controller');
const { getArticleComments } = require('../controllers/get-article-comments.controller');
const { getArticles } = require('../controllers/get-articles.controller');
const { patchArticleId } = require('../controllers/patch-article-id.controller');
const { postComment } = require('../controllers/post-comment.controller');
const { queryTopic } = require('../controllers/queryTopic.controller');

const articlesRouter = require('express').Router();

articlesRouter.get('/:articles_id', getArticles)
articlesRouter.get('/', getAllArticles)
articlesRouter.get('/:article_id/comments', getArticleComments)

articlesRouter.post('/:article_id/comments', postComment)

articlesRouter.patch('/:article_id', patchArticleId)

articlesRouter.get('/?sort_by=:value', queryTopic)

module.exports = articlesRouter