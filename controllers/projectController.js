const pool = require('../dbconfig')
const jwt = require('jsonwebtoken')

async function getAllTables(req, res){
    const { name } = req.params
    const {username, user_id } = jwt.decode(req.cookies.token)
    // TODO add tables which user is not owner of 
    try{
        const query = 'SELECT * FROM tables WHERE creator_id = $1'
        const result = await pool.query(query, [user_id])
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

async function getTableByName(req, res){
    const { name } = req.params
    const { user_id } = jwt.decode(req.cookies.token)
    // TODO user should be able to have access to projects that he is not owner of 
    try{
        const query = 'SELECT * FROM tables WHERE name = $1 AND creator_id = $2'
        const result = await pool.query(query, [name, user_id])
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

async function createTable(req, res){
   const { tableName } = req.body 
    const { user_id } = jwt.decode(req.cookies.token)


    try{
        const query = 'INSERT INTO tables (title, creator_id) VALUES ($1, $2)'
        const result = await pool.query(query, [tableName, user_id])

        return res.send(201).send({
            success : true
        })
    }catch(err){
        console.log(err)
        res.status(500).send({
            success : false,
            message : err
        })
    }
}

async function deleteTable(req, res){
}


module.exports = {
    getAllTables,
    getTableByName,
    createTable,
    deleteTable
}
