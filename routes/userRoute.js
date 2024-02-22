const { authenticateJwt, restrictTo } = require('../controllers/authCtrl')
const { getAllUsers } = require('../controllers/userCtrl')

const router = require('express').Router()

router.get('/', authenticateJwt, restrictTo(['user']), getAllUsers)

const userRoute = router

module.exports = userRoute