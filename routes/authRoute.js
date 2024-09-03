const express = require('express')
const { registerUserController, loginUserController } = require('../controllers/authController')

const router = express.Router()


router.post('/register', registerUserController)
router.post('/login', loginUserController)

module.exports = router
