const express = require('express')
const router = express.Router()
const path = require('path')
const fs = require('fs')
const { protect } = require('../guard')

router.use('/s', express.static(path.resolve(__dirname, '../', 'static')))

router.get('/login', async (req, res) => { 
  const file = await getFile('login.html')
  res.status(200).send(file) 
})

router.get('/admin', protect, async (req, res) => { 
  const file = await getFile('admin.html')
  res.status(200).send(file) 
})

const getFile = async (filename) => {
  return await new Promise((resolve, reject) => 
    fs.readFile(path.resolve(__dirname, filename), { encoding: 'UTF-8' }, 
      (err, data) => err ? reject(err) : resolve(data)
    )
  )
}

module.exports = router