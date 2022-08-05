class Sender {
  constructor() {
    this.form = require('../repository/form')
    this.email = require('../email')
    this.verifyCaptcha = require('../captcha')
  }
  async route(req, res) {
    const payload = req.body

    if(!payload.formkey) return res.status(401).json({e: "Unauthorized"})

    const result = await this.send(payload)

    const message = 
      result === 200 ? 'Envio Realizado com sucesso' : 
      result === 403 ? 'Invalid Captcha' : 
      result === 403 ? 'Não encontrado' : 
      'Erro Interno'

    return res.status(result).json({resultado: message})
  }
  async send(payload) {
    try {
      const form = await this.form.getById(payload.formkey)
      if(!form) return 404 
  
      if(form.captcha) {
        const validation = this.verifyCaptcha(payload.captcha)
  
        if(!validation) return 403
      }
  
      const emailContent = this.email.createEmailContent(payload)
  
      await this.email.sendEmail(
        form.name, 
        'no-reply@faneylab.com', 
        form.email, 
        'Novo contato pelo Formulário', 
        emailContent.html, 
        emailContent.text
      )
      return 200 
    } catch (error) {
      return 500
    }
  }
}

module.exports = new Sender()