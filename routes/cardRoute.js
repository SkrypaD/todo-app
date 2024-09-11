const express = require('express')

const {createCard, deleteCard, updateCard, getAllCards, getAllCardForTable} = require('../controllers/cardController')
const { signInRequired, chosenTableRequired } = require('../middleware/authorizationController')

const router = express.Router()

router.get('/get-all-cards', signInRequired, getAllCards)
router.post('/create-card', signInRequired, chosenTableRequired, createCard) 
router.delete('/delete-card/:id', signInRequired, chosenTableRequired, deleteCard) 
router.patch('/update-card/:id', signInRequired, chosenTableRequired, updateCard)
router.get('/get-cards-for-table/:id', signInRequired, getAllCardForTable)

module.exports = router
