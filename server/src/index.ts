/* eslint-disable import/first */
require('dotenv').config()
import express from 'express'
import routes from './routes'
import middlewares from './middlewares'
import dbConnect from './config/database'

const port = 3001
const base = '/api'

const app = express()

dbConnect()

app.use(base, middlewares)
app.use(base, routes)

app.listen(port)

console.log(`Access your app now on http://localhost:${port}`)

// this route can be removed
app.get('/', (req, res) => res.send('Node app is live'))

export default app
