const express = require('express')
const { getAllProjects, getProjectByName } = require('../controllers/projectController')
const { signInRequired } = require('../middleware/authorizationController')

const router = express.Router()

router.get('/',signInRequired, getAllProjects)
router.get('/:name',signInRequired, getProjectByName)

module.exports = router
