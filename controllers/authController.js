require('dotenv').config()
const pool = require('../dbconfig')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')


async function loginUserController(req, res){
    const { username, password } = req.body

    if(!username || !password){
        res.status(400).send({
            success : false,
            message : 'Username and password required!'
        })
    }

    try{
        const query = 'SELECT * FROM users WHERE name = $1'
        const user = await pool.query(query, [username])

        const isMatch = await bcrypt.compare(password, user.rows[0].password)
        if(isMatch){
            let token = jwt.sign({ username : username }, process.env.SECRET,{
                expiresIn : '1h'
            })

            res.cookie('token', token, {
                httpOnly : true
            })
            res.status(200).send({
                success : true,
                message : 'Logged in!!!'
            })
        }else{
            res.status(401).send({
                success : false,
                message : "Invalid password"
            })
        }
    }catch(err){
        res.status(400).send({
            success : false,
            message : 'Invalid data try again...',
        })
    }
}

async function registerUserController(req, res ){
    const { username, password, email } = req.body
    
    if(!username || !password || !email){
        return res.status(400).send({
            status : false,
            message : 'Invalid data'
        })
    }

    try{
        const query = 'INSERT INTO users VALUES ($1, $2, $3);'
        const hashedPassword = await bcrypt.hash(password, (process.env.SALT_ROUNDS, 10))
        const result = await pool.query(query, [username, hashedPassword, email])

        res.status(200).send({
            success : true,
            message : 'Account registered'
        })
       
    }catch(err){
        console.log(err)
        res.status(400).send({
            success : false,
            message : 'Could not create an account try again...',
        })
    }
}

module.exports = {
    loginUserController,
    registerUserController
}
