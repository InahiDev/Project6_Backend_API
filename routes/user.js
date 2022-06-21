const express = require('express')
const router = express.Router()
const userCtrl = require('../controllers/user')
const passwordControler = require('../middleware/passwordCtrl')

router.post('/signup', passwordControler, userCtrl.signup)
router.post('/login', userCtrl.login)

module.exports = router