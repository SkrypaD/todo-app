require('dotenv').config()
const jwt = require('jsonwebtoken')

function signInRequired(req, res, next){
    const token = req.headers['authorization'].split(' ')[1]
    if(token == null){
        return res.status(401).send({
            success : false,
            message : "Token required!"
        })
    }
    const isValid = jwt.verify(token, process.env.SECRET)
    if(isValid){
        return next()
    }else{
        return res.status(400).send({
            success : false,
            message : "Invalid token"
        })
    }
}

function chosenTableRequired(req, res, next){
    if(req.headers['tableid']){
        return next()
    }else{
        return res.status(404).send({
            success : false,
            message : "You need to chose table!!"
        })
    }
}


module.exports = {
    signInRequired,
    chosenTableRequired
}
