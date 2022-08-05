const express = require('express')
const router = require('express').Router()
const userRepo = require('./repository/user')
const formRepo = require('./repository/form')
const sender = require('./services/sender')

router.post('/api/auth', async (req, res) => {
  try {
    const payload = req.body
    if(payload.username && payload.password) {
      const result = await userRepo.auth(payload.username, payload.password)
      if(result.username) {
        req.session.isLogedIn = true
        return res.redirect('/admin')
      }
    }
    return res.status(403).redirect('/login')  
  } catch (error) {
    return res.status(500).send('Erro')
  }
})

router.post('/api/auth/logout', (req, res) => {
  req.session.destroy()
  return res.status(200).redirect('/login')
})

router.get('/api/form', async (req, res) => {
  try {
    const response = await formRepo.getList()
    return res.status(200).json(response)
  } catch(err) {
    return res.status(500).send('Erro')
  }
})

router.post('/api/form', async (req, res) => {
  try {
    const form = req.body
    if(form.name && form.email && typeof(form.captcha) === 'boolean') {
      form.date = Date.now()
      const result = await formRepo.create(form)
      return res.status(200).json(result)  
    } else {
      return res.status(400).send("Invalid Form")
    }
  } catch (error) {
    return res.status(500).send("Erro")
  }
})

router.delete('/api/form/:id', async (req, res) => {
  try {
    const id = req.params.id
    if(id){
      await formRepo.remove(id)
      return res.status(200).send('OK')
    } else {
      return res.status(400).send("Invalid ID")
    }
  } catch (err) {
    console.log(err)
    return res.status(500).send('Erro')
  }
})

router.post('/v1/sendEmail', sender.route)

router.use('**', (req, res) => res.status(404).send('Not Found'))

module.exports = router
