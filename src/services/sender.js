class Sender {
  constructor() {
    this.form = require('../repository/form')
    this.email = require('../email')
    this.verifyCaptcha = require('../captcha')
  }
  async route(req, res) {
    const payload = req.body

    if(!payload.formkey) return res.status(401).json({success: false, message: "Unauthorized"})

    if(Object.keys(payload).filter(key => payload[key]).length === 0)
      return res.status(400).json({sucess: false, message: "Bad Request"})

    const result = await this.send(payload)

    const message = 
      result === 200 ? 'Envio Realizado com sucesso' : 
      result === 401 ? 'Invalid Captcha' : 
      result === 403 ? 'Invalid ID' :
      result === 404 ? 'Não encontrado' : 
      'Erro Interno'

    return res.status(result).json({success: result === 200, message})
  }
  async send(payload) {
    try {
      if(payload.formkey.length != 24) return 403
      const form = await this.form.getById(payload.formkey)
      if(!form) return 404 
  
      if(form.captcha) {
        if(!payload['h-captcha-response'] && !payload.captcha) return 401

        const validation = await this.verifyCaptcha(payload['h-captcha-response'] || payload.captcha)
  
        if(!validation) return 401
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
    } catch (err) {
      console.log(err)
      return 500
    }
  }
}

module.exports = new Sender()