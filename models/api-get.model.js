const db = require("../db/connection")
const fs = require("fs/promises")

exports.getApi = () => {

return fs.readFile('./endpoints.json', 'utf-8').then((endPoints , err)=> {
    const parsed = JSON.parse(endPoints)
    return parsed     

}).catch((err) => {
    return err
})

}