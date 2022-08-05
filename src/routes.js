const express = require('express')
const router = require('express').Router()
const userRepo = require('./repository/user')
const formRepo = require('./repository/form')
const sender = require('./services/sender')

const { protect } = require('./guard')

router.post('/api/auth', async (req, res) => {
  try {
    const payload = req.body
    if(payload.username && payload.password) {
      const result = await userRepo.auth(payload.username, payload.password)
      if(result.username) {
        req.session.user = {
          id: result._id,
          username: result.username,
          type: result.type,
          maxForms: result.maxForms
        }
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

router.get('/api/form', protect, async (req, res) => {
  try {
    const user = req.session.user
    const response = await formRepo.getList(user.type !== 'ADMIN' ? user : null)
    return res.status(200).json(response)
  } catch(err) {
    console.log(err)
    return res.status(500).send('Erro')
  }
})

router.post('/api/form', protect, async (req, res) => {
  try {
    const user = req.session.user
    const form = req.body
    if(form.name && form.email && typeof(form.captcha) === 'boolean') {
      form.date = Date.now()
      form.userId = req.session.user.id

      let count = 0 
      if(user.type !== 'ADMIN') {
        count = await formRepo.count(user)
      }
      if(count >= user.maxForms) return res.status(401).json({message: "Limite de formularios atingido"})

      if(user.maxForms === 1) form.captcha = false
      let result = await formRepo.create(form)
      if(result.acknowledged) {
        form._id = result.insertedId
        result = form
      }
      return res.status(200).json(result)
    } else {
      return res.status(400).send("Invalid Form")
    }
  } catch (error) {
    return res.status(500).send("Erro")
  }
})

router.delete('/api/form/:id', protect, async (req, res) => {
  try {
    const id = req.params.id
    const user = req.session.user
    if(id){
      await formRepo.remove(id, user.type !== 'ADMIN' ? user : null)
      return res.status(200).send('OK')
    } else {
      return res.status(400).send("Invalid ID")
    }
  } catch (err) {
    console.log(err)
    return res.status(500).send('Erro')
  }
})

router.post('/v1/send', (req, res) => sender.route(req, res))

router.use('**', (req, res) => res.status(404).send('Not Found'))

module.exports = router
