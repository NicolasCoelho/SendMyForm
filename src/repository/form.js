const { getClient } = require('../database')
const { ObjectId } = require('mongodb')

module.exports = {
  async getById(id) {
    const client = await getClient()
    const result = await client.db('main').collection('forms').findOne({_id: ObjectId(id)})
    client.close()
    return result
  },
  async getList() {
    const client = await getClient()
    const result = await client.db('main').collection('forms').find().toArray()
    client.close()
    return result
  },
  async create(form) {
    const client = await getClient()
    const result = await client.db('main').collection('forms').insertOne(form)
    client.close()
    return result
  },
  async remove(id) {
    const client = await getClient()
    const result = await client.db('main').collection('forms').deleteOne({_id: ObjectId(id)})
    client.close()
    return result
  }
}