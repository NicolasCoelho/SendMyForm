const sgMail = require('@sendgrid/mail')
class EmailSender {
    constructor() {
        const apiKey = process.env.SENDGRID_API_KEY
        sgMail.setApiKey(apiKey)
    }
    async sendEmail(params) {
        const msg = {
            to: params.to,
            from: params.from,
            subject: params.subject !== undefined ? params.subject : "Novo contato pelo site!",
            text: params.message,
            html: params.message,
        }; 
        try {
            await sgMail.send(msg);
        } catch (error) {
            console.error(error);
            if (error.response) {
                console.error(error.response.body)
            }
            return error.response
        }      
    }
}

module.exports = new EmailSender()