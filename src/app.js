require('dotenv').config()
const app = require('express')()
const views = require('./views')
const routes = require('./routes')
const middlewares = require('./middleware')

const session = require('express-session')
const sessionConfig = { 
  secret: process.env.SESSION_SECRET, 
  cookie: { maxAge: 600000 }
}
if (app.get('env') === 'production') {
  app.set('trust proxy', 1)
  sessionConfig.cookie.secure = true
}
app.use(session(sessionConfig))

app.use(middlewares)
app.use(views)
app.use(routes)

const port = process.env.PORT
app.listen(port, () => console.log(`Server running on http://localhost:${port}`))