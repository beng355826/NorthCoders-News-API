const db = require("../db/connection")
const {selectTopics} = require("../models/get-api-topics.model")

const getTopics = (req, res) => {
    
 return selectTopics().then((data) =>{
    const response = {}
    response.AllTopics = data

res.status(200).send(response)

 })

}


module.exports = {getTopics}
