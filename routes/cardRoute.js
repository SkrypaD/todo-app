const express = require('express')

const {createCard, deleteCard, updateCard, getAllCards, getAllCardForTable} = require('../controllers/cardController')
const { signInRequired } = require('../middleware/authorizationController')

const router = express.Router()

router.post('/create-card', signInRequired, createCard) 
router.get('/get-all-cards', signInRequired, getAllCards)
router.delete('/delete-card/:id', signInRequired, deleteCard) 
router.patch('/update-card/:id', signInRequired, updateCard)
router.get('/get-cards-for-table/:id', signInRequired, getAllCardForTable)

module.exports = router
