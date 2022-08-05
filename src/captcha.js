const { verify } = require('hcaptcha')

module.exports = async (token) => {
    if (token === undefined || token === null || token === '') return false
    try {
        const result = await verify(process.env.HCAPTCHA_KEY, token)
        return result.success
    } catch {
        return false
    }
}