const {selectArticleComments} = require("../models/get-article-comments.model")


const getArticleComments = (req, res, next) => {

return selectArticleComments().then((data))


}



module.exports = {getArticleComments}