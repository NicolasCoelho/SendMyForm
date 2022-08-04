const express = require('express')
const router = require('express').Router()

/**
 * TODO
 * Pass to controllers
 */

const user = {
  name: 'nicolas',
  password: '123'
}

router.post('/api/auth', (req, res) => {
  if(user.name === req.body.name && user.password === req.body.password) {
    req.session.isLogedIn = true
    return res.redirect('/admin')
  } else {
    return res.status(403).redirect('/login')
  }
})

router.post('/api/auth/logout', (req, res) => {
  req.session.destroy()
  return res.status(200).redirect('/login')
})

router.use('**', (req, res) => res.status(404).send('Not Found'))

module.exports = router
