const express = require('express')
const router = express.Router()

const sauceCtrl = require('../controllers/sauce')
const auth = require('../middleware/auth')
const authModify = require('../middleware/authModify')
const multer = require('../middleware/multer-config')

router.get('/', auth, sauceCtrl.getAllSauces)
router.get('/:id', auth, sauceCtrl.getOneSauce)
router.post('/', auth, multer, sauceCtrl.createSauce)
router.put('/:id', authModify, multer, sauceCtrl.updateSauce)
router.delete('/:id', authModify, sauceCtrl.deleteSauce)
router.post('/:id/like', auth, sauceCtrl.likeStatus)

module.exports = router