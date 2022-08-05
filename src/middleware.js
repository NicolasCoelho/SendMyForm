const express = require('express')
const router = express.Router()
const helmet = require('helmet')

router.use(express.urlencoded())
router.use(express.json())
router.use(helmet())

router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", '*')
  res.header("Access-Control-Expose-Headers", "Content-Type,Content-Length, Accept,X-Requested-With")
  res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With, Captcha")
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS")
  if (req.method !== 'GET' && req.method !== 'POST' && req.method !== 'PUT' && req.method !== 'DELETE') {
      return res.status(200).send()
  } else {
      return next()
  }
})

module.exports = router