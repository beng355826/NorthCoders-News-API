const db = require("../db/connection")
const {selectTopics} = require("../models/get-api-topics.model")

const getTopics = (req, res) => {
    
 return selectTopics().then((data) =>{
    const response = {}
    response.msg = "200 - request successful"
    response.AllTopics = data

res.status(200).send(response)

 })

}


module.exports = {getTopics}
