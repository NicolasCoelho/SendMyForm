const { getClient } = require('../database')
const { ObjectId } = require('mongodb')

module.exports = {
  async getById(id) {
    const client = await getClient()
    const result = await client.db('main').collection('forms').findOne({_id: ObjectId(id)})
    client.close()
    return result
  },
  async getList(user) {
    const client = await getClient()
    const filter = user ? {userId: user.id} : {}
    let result = await client.db('main').collection('forms').find(filter).toArray()
    client.close()
    return result
  },
  async create(form) {
    const client = await getClient()
    const result = await client.db('main').collection('forms').insertOne(form)
    client.close()
    return result
  },
  async remove(id, user=null) {
    const filter = {_id: ObjectId(id)}
    if(user) filter.userId = user.id
    const client = await getClient()
    const result = await client.db('main').collection('forms').deleteOne(filter)
    client.close()
    return result
  },
  async count(user=null) {
    const client = await getClient()
    const filter = user ? {userId: user.id} : {}
    let result = await client.db('main').collection('forms').countDocuments(filter)
    client.close()
    return result
  }
}