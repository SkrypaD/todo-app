const pool = require('../dbconfig')
const jwt = require('jsonwebtoken')

async function getAllProjects(req, res){
    const { name } = req.params
    const {username } = jwt.decode(req.cookies.token)
    // TODO add user for projects table so user can choose only his own projects
    try{
        const query = 'SELECT * FROM lists'
        const result = await pool.query(query)
        const data = result.rows
        res.status(200).json({
            success : true,
            data : data
        })
    }catch(err){
        console.log(err)
        res.status(500).send({
            success : false,
            message : 'Internal server error'
        })
    }
}

async function getProjectByName(req, res){
    const { name } = req.params
    const {username } = jwt.decode(req.cookies.token)
    // TODO add user for projects table so user can choose only his own projects
    try{
        const query = 'SELECT * FROM lists WHERE name = $1'
        const result = await pool.query(query, [name])
        if(result.rows.length === 0){
            return res.send(400).send({
                success : false,
                message : 'No such project found!'
            })
        }
        res.status(200).send({
            success : true,
            data : result.rows[0]
        })
    }catch(err){
        console.log(err)
        res.send(500).send({
            success : false,
            message : err
        })
    }
}


module.exports = {
    getAllProjects,
    getProjectByName
}
