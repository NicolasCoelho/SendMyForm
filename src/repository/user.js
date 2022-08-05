const { getClient } = require('../database')

module.exports = {
  async auth(username, password) {
    try {
      const client = await getClient()
      const result = await client.db('main').collection('users').findOne({username, password})
      
      client.close()
      
      return result
    } catch (err) {
      return new Error(err)
    }
  },
}