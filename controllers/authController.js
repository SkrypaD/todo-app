require('dotenv').config()
const pool = require('../dbconfig')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')


async function loginUserController(req, res, next){
    const { username, password } = req.body


    try{
        const query = 'SELECT * FROM users WHERE username = $1'
        const user = await pool.query(query, [username])

        const hashedPassword = bcrypt.hash(password, process.env.SECRET)
        const isMatch = bcrypt.compare(hashedPassword, user.rows[0].password)

        if(isMatch){
            let token = jwt.sign({ username : username }, process.env.SECRET,{
                expiresIn : '1h'
            })

            res.cookie('token', token, {
                httpOnly : true
            })
        }else{
            res.status(401).send({
                success : false,
                message : "Invalid password"
            })
        }
        next()
    }catch(err){
        res.status(400).send({
            success : false,
            message : 'Invalid data try again...',
        })
    }
}

async function registerUserController(req, res, next){
}


module.exports = {
    loginUserController,
    registerUserController
}
