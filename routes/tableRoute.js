const express = require('express')
const { getAllTables, getTableByName, createTable, deleteTable, addTableUser } = require('../controllers/tableController')
const { signInRequired } = require('../middleware/authorizationController')

const router = express.Router()

router.get('/',signInRequired, getAllTables)
router.get('/:title',signInRequired, getTableByName)
router.post('/create-table', signInRequired, createTable)
router.delete('/delete-table/:id', signInRequired, deleteTable)
router.post('/add-user', signInRequired, addTableUser)

module.exports = router
