require('dotenv').config()
const pool = require('../dbconfig')
const jwt = require('jsonwebtoken')


async function createCard(req, res){
    const table_id = req.cookies.table_id
    const { user_id } = jwt.decode(req.cookies.token)
    const { title, content, deadline } = req.body

    if(table_id == null){
        return res.status(404).send({
            success : false,
            message : 'Select table to create card into'
        })
    }

    try{
        const query = 'INSERT INTO cards (title, content, deadline, table_id, creator_id ) VALUES ($1, $2, $3, $4, $5)'
        const result = await pool.query(query, [title, content, deadline, table_id, user_id])

        return res.status(201).send({
            success : true,
            message : 'New card created!'
        })
    }catch(err){
        console.log(err)
        return res.status(500).send({
            success : false,
            message : err
        })
    }
} 

async function deleteCard(req, res){
    const table_id = req.cookies.table_id
    const { user_id } = jwt.decode(req.cookies.token)
    const { id } = req.params

    try{
        const query = 'DELETE FROM cards WHERE id = $1'
        const result = await pool.query(query, [id])

        return res.status(204).send({
            success : true,
            message : 'Card has been deleted'
        })
    }catch(err){
        console.log(err)
        return res.status(500).send({
            success : false,
            message : err
        })
    }
}

async function updateCard(req, res){
    const table_id = req.cookies.table_id
    const { user_id } = jwt.decode(req.cookies.token)
    const { id } = req.params
    const data = req.body

    let change = ''
    const keys = Object.keys(data);

    keys.forEach((key, index) => {
        change += ` ${key}='${data[key]}'`;
        if (index < keys.length - 1) {
            change += ',';
        }
    });

    try{
        const query = 'UPDATE cards SET ' + change + 'WHERE id = $1'
        const result = await pool.query(query, [id])
        
        if(result.rowCount === 0){
            return res.status(404).send({
                success : false,
                message : 'Card not fould'
            })
        }

        return res.status(203).send({
            success : true,
            message : 'Card has been updated'
        })
    }catch(err){
        console.log(err)
        return res.status(500).send({
            success : false,
            message : err
        })
    }
}

async function getAllCards(req, res){
    const { user_id } = jwt.decode(req.cookies.token)

    try{
        const query = 'SELECT * FROM cards WHERE creator_id = $1'
        const result = await pool.query(query, [user_id])

        return res.status(200).send({
            success : true,
            message : result.rows[0]
        })
    }catch(err){
        console.log(err)
        return res.status(500).send({
            success : false,
            message : err
        })
    }
}

async function getAllCardForTable(req, res){
    const { id } = req.params

    try{
        const query = 'SELECT * FROM cards WHERE table_id = 6'
        const result = await pool.query(query)

        return res.status(200).send({
            success : true,
            data : result.rows[0]
        })
    }catch(err){
        console.log(err)
        return res.status(500).send({
            success : false,
            message : err
        })
    }
}

async function getNewCardsForTable(req, res){
}

async function getInProgressCardsForTable(req, res){
}

async function getDoneCardsForTable (req, res){
}


module.exports = {
    createCard, 
    deleteCard,
    updateCard,
    getAllCards,
    getAllCardForTable,
    getNewCardsForTable,
    getInProgressCardsForTable,
    getDoneCardsForTable
}
