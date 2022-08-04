require('dotenv').config()
const app = require('express')()
const views = require('./views')
const routes = require('./routes')
const middlewares = require('./middleware')

app.use(middlewares)
app.use(views)
app.use(routes)

if (app.get('env') === 'production') {
  app.set('trust proxy', 1)
  session.cookie.secure = true
}

const port = process.env.PORT
app.listen(port, () => console.log(`Server listening on port ${port}`))