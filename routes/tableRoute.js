const express = require('express')
const { getAllTables, createTable, deleteTable, addTableUser ,getTableById } = require('../controllers/tableController')
const { signInRequired } = require('../middleware/authorizationController')

const router = express.Router()

router.get('/',signInRequired, getAllTables)
router.get('/:id',signInRequired, getTableById)
router.post('/create-table', signInRequired, createTable)
router.delete('/delete-table/:id', signInRequired, deleteTable)
router.post('/add-user', signInRequired, addTableUser)

module.exports = router
