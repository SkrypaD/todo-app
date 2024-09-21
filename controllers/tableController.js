const pool = require('../dbconfig')
const jwt = require('jsonwebtoken')

async function getAllTables(req, res){
    const {user_id } = jwt.decode(req.headers['authorization'].split(' ')[1])
    try{
        const query = 'SELECT tables.* FROM tables LEFT JOIN table_users ON tables.id = table_users.table_id WHERE tables.creator_id = $1 OR table_users.user_id = $1'
        const result = await pool.query(query, [user_id])
        const data = result.rows

        if(data.length === 0){
            return res.sendStatus(204)
        }
        return res.status(200).json({
            success : true,
            data : data
        })
    }catch(err){
        console.log(err)
        return res.status(500).send({
            success : false,
            message : 'Internal server error'
        })
    }
}


async function getTableById(req, res){
    const { id } = req.params
    const { user_id } = jwt.decode(req.headers['authorization'].split(' ')[1])

    try{
        const query = 'SELECT tables.* FROM tables LEFT JOIN table_users ON tables.id = table_users.table_id WHERE tables.id = $1 AND (tables.creator_id = $2 OR table_users.user_id = $2)'
        const result = await pool.query(query, [id, user_id])
        if(result.rows.length === 0){
            return res.status(400).send({
                success : false,
                message : 'No such table found!'
            })
        }

        return res.status(200).send({
            success : true,
            data : result.rows[0],
            tableid : result.rows[0].id
        })
    }catch(err){
        console.log(err)
        res.status(500).send({
            success : false,
            message : err
        })
    }
}

async function createTable(req, res){
   const { title } = req.body 
    const { user_id } = jwt.decode(req.headers['authorization'].split(' ')[1])

    try{
        const query = 'INSERT INTO tables (title, creator_id) VALUES ($1, $2)'
        const result = await pool.query(query, [title, user_id])

        return res.status(201).send({
            success : true
        })
    }catch(err){
        console.log(err)
        return res.status(500).send({
            success : false,
            message : err
        })
    }
}

async function deleteTable(req, res){
    const { id } = req.params
    const { user_id } = jwt.decode(req.headers['authorization'].split(' ')[1])

    try{
        const query = 'DELETE FROM tables WHERE id = $1 AND creator_id = $2'
        const result = await pool.query(query, [id, user_id])
        if(result.rowCount === 0){
            return res.status(404).send({
                success : false,
                message : 'Table does not exist or you does not have required rights'
            })
        }
        return res.status(201).send({
            success : true,
            message : 'Table deleted successfully'
        })
    }catch(err){
        console.log(err)
        return res.status(500).send({
            success : false,
            message : err
        })
    }
}

async function addTableUser(req, res){
    const {tableId, userToAddId} = req.body
    const { user_id } = jwt.decode(req.headers['authorization'].split(' ')[1])
    
    try{
        const query = 'INSERT INTO table_users (table_id, user_id) SELECT $1, $2  FROM tables WHERE tables.creator_id = $3 AND tables.id = $1;'
        const result = await pool.query(query, [tableId, userToAddId, user_id])


        return res.status(201).send({
            success : true,
            message : 'User added to table'
        })
    }catch(err){
        console.log(err)
        return res.status(500).send({
            success : false,
            message : err
        })
    }
}


module.exports = {
    getAllTables,
    getTableById,
    createTable,
    deleteTable,
    addTableUser
}
