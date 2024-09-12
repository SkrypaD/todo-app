require('dotenv').config()
const pool = require('../dbconfig')
const jwt = require('jsonwebtoken')


async function createCard(req, res){
    const table_id = req.cookies.table_id
    const { user_id } = jwt.decode(req.cookies.token)
    const { title, content, deadline } = req.body

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
    const { user_id } = jwt.decode(req.cookies.token)
    const { id } = req.params

    try{
        const query = 'DELETE FROM cards WHERE id = $2 AND ( table_id IN ( SELECT table_id FROM table_users WHERE user_id = $1) OR table_id IN ( SELECT id FROM tables WHERE creator_id = $1));'
        const result = await pool.query(query, [user_id, id])

        if(result.rowCount === 0){
            return res.status(404).send({
                success : false,
                message : 'Such card do not exist'
            })
        }

        return res.status(203).send({ success : true,
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

    if(keys.length === 0){
        return res.status(400).send({
            success : false,
            message : "Bad request!"
        })
    }

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
        const query = 'SELECT DISTINCT(cards.*)  FROM cards JOIN table_users ON cards.table_id = table_users.table_id LEFT JOIN tables ON cards.table_id = tables.id WHERE table_users.user_id = $1 OR tables.creator_id = $1'
        const result = await pool.query(query, [user_id])
        return res.status(200).send({
            success : true,
            message : result.rows
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
    const { user_id } = jwt.decode(req.cookies.token)

    try{
        const query = 'select distinct(cards.*) from cards join tables on cards.table_id = tables.id join table_users on cards.table_id = table_users.table_id where cards.table_id = $1 and( tables.creator_id = $2 or table_users.user_id = $2)'
        const result = await pool.query(query, [id, user_id])
        if(result.rows.length == 0){
            return res.sendStatus(204)
        }
        return res.status(200).send({
            success : true,
            data : result.rows
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
    getAllCardForTable
}
