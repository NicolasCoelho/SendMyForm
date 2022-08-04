const express = require('express')
const router = express.Router()
const helmet = require('helmet')

router.use(express.urlencoded())
router.use(express.json())
router.use(helmet())

module.exports = router