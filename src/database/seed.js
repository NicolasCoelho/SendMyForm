require('dotenv').config()
const { getClient } = require('./index')

async function auth(username, password) {
  try {
    const client = await getClient()
    const result = await client.db('main').collection('users').findOne({username, password})
    client.close()
    return result
  } catch (err) {
    return new Error(err)
  }
}

async function createUser(username, password) {
  try {
    const client = await getClient()
    const result = await client.db('main').collection('users').insertOne({username, password})
    client.close()
    return result
  } catch (err) {
    return new Error(err)
  }
}

(async () => {
  const a = await auth('nicolas', '@vilelam_')
  console.log(a)
})()
