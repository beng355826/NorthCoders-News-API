const { getAllArticles } = require('../controllers/get-All-Articles.controller');
const { getArticleComments } = require('../controllers/get-article-comments.controller');
const { getArticles } = require('../controllers/get-articles.controller');
const { patchArticleId } = require('../controllers/patch-article-id.controller');
const { postArticleCon } = require('../controllers/post-article.controller');
const { postComment } = require('../controllers/post-comment.controller');
const { queryTopic } = require('../controllers/queryTopic.controller');

const articlesRouter = require('express').Router();

articlesRouter.get('/', getAllArticles)
articlesRouter.post('/', postArticleCon)
articlesRouter.get('/?sort_by=:value', queryTopic)


articlesRouter.get('/:articles_id', getArticles)
articlesRouter.patch('/:article_id', patchArticleId)


articlesRouter.get('/:article_id/comments', getArticleComments)
articlesRouter.post('/:article_id/comments', postComment)










module.exports = articlesRouter