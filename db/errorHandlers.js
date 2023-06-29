
const error400Handler = (err, req, res, next) => {
    if(err.code === '22P02'){
        res.status(400).send({msg: '400 - invalid type request'})
    }
    if(err.code === '23502'){
        res.status(400).send({msg: '400 - not found'})
    }
    next(err)
}


const error404Handler = (err,req, res, next) => {
    res.status(404).send({
        msg:'404 - not found'
    })
    next(err)
}

const error500Handler = (err, req, res, next) => {
    res.status(500).send({msg: "500 server error"})
}



module.exports = {error400Handler, error404Handler, error500Handler}