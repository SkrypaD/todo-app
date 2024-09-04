require('dotenv').config()
const jwt = require('jsonwebtoken')

function signInRequired(req, res, next){
    const token = req.cookies.token
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


module.exports = {
    signInRequired
}
