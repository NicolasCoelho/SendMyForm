require('dotenv').config()
const { getClient } = require('./index')
const { ObjectId } = require('mongodb')

async function auth(username, password) {
  try {
    const client = await getClient()
    const result = await client.db('main').collection('users').findOne({username, password})
    client.close()
    console.log(result)
    return result
  } catch (err) {
    return new Error(err)
  }
}

async function createUser(username, password, type, maxForms) {
  try {
    const client = await getClient()
    const result = await client.db('main').collection('users').insertOne({username, password, type, maxForms})
    client.close()
    console.log(result)
    return result
  } catch (err) {
    return new Error(err)
  }
}
async function deleteUser(id) {
  try {
    const client = await getClient()
    const result = await client.db('main').collection('users').deleteOne({_id: ObjectId(id)})
    client.close()
    console.log(result)
    return result
  } catch (err) {
    return new Error(err)
  }
}
async function getUserList() {
  try {
    const client = await getClient()
    const result = await client.db('main').collection('users').find().toArray()
    client.close()
    console.log(result)
    return result
  } catch (err) {
    return new Error(err)
  }
}
async function getUser(id) {
  try {
    const client = await getClient()
    const result = await client.db('main').collection('users').find({_id: ObjectId(id)})
    client.close()
    console.log(result)
    return result
  } catch (err) {
    return new Error(err)
  }
}
async function updateUser(id, user) {
  try {
    const client = await getClient()
    const result = await client.db('main').collection('users').updateOne({_id: ObjectId(id)}, {$set: user})
    client.close()
    console.log(result)
    return result
  } catch (err) {
    return new Error(err)
  }
}
async function getFormsList() {
  try {
    const client = await getClient()
    const result = await client.db('main').collection('forms').find().toArray()
    client.close()
    console.log(result)
    return result
  } catch (err) {
    return new Error(err)
  }
}
async function updateForm(id, form) {
  try {
    const client = await getClient()
    const result = await client.db('main').collection('forms').updateOne({_id: ObjectId(id)}, {$set: form})
    client.close()
    console.log(result)
    return result
  } catch (err) {
    return new Error(err)
  }
}
async function count(user=null) {
  const client = await getClient()
  const filter = user ? {userId: ObjectId(user.id)} : {}
  let result = await client.db('main').collection('forms').countDocuments(filter)
  console.log(result)
  client.close()
  return result
}

(async () => {
  // await createUser('nicole', 'teste123', 'USER', 1)
  // await auth('nicolas', '@vilelam_')
  // await getUserList()
  // await updateUser('62ebdb9717a88918d5726d60', {type: 'ADMIN', maxForms: 10000})
  await getFormsList()
  // await updateForm('62ec32b20d3d069b47a28170', {userId: '62ebdb9717a88918d5726d60'}) 
  // await count()
  // await deleteUser('62ed848c835f6a06c243469e')
})()
