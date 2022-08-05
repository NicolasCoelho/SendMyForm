const SES = require('aws-sdk/clients/ses')

class Email {
  constructor() {
    this.emailClient = new SES({
      credentials: {
          accessKeyId: process.env.AWS_SES_ID,
          secretAccessKey: process.env.AWS_SES_KEY
      },
      region: 'us-east-1',
    })
  }
  async sendEmail(name, origin, target, title, htmlContent, textContent = "") {
    return await this.emailClient.sendEmail({
      Source: `${name} <contact@faneylab.com>`,
      Destination: {
        ToAddresses: [
          target
        ]
      },
      ReplyToAddresses: [
        origin
      ],
      Message: {
        Subject: {
          Data: title
        },
        Body: {
          Html: {
            Data: htmlContent
          },
          Text: {
            Data: textContent
          }
        }
      },
      ConfigurationSetName: 'sendmyform'
    }).promise()
  }
  createEmailContent(obj) {
    delete obj.formkey
    if(obj.captcha) delete obj.captcha
    if(obj['g-recaptcha-response']) delete obj['g-recaptcha-response']
    if(obj['h-captcha-response']) delete obj['h-captcha-response']

    const html = `
      <html>
        <head></head>
        <body>
          <table width="600" style="text-align: center;">
            <tbody>
              <tr>
                <td><h1>Novo contato pelo Formul&aacute;rio</h1></td>
              </tr>
              ${ Object.keys(obj).slice(0, 100).map(key => this.createRow(key, obj[key])).join('') }
            </tbody>
          </table>
        </body>
      </html>
    `
    const text = Object.keys(obj).map(key => `${key}: ${obj[key]} \n`).join('')
    return {html, text}
  }
  createRow(key, value) {
    return `
      <tr>
        <td style="padding: 10px 0px 10px 0px;"> <b>${key}</b> <br/> <span>${value}</span> </td>
      </tr>
    `
  }
}

module.exports = new Email()