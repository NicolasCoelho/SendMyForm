const express = require('express')
const router = express.Router()
const helmet = require('helmet')
const session = require('express-session')

router.use(express.urlencoded())
router.use(express.json())
router.use(helmet())
router.use(session({ secret: process.env.SESSION_SECRET, cookie: { maxAge: 60000 }}))

module.exports = router