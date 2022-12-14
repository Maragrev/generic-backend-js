require('dotenv').config()
require('reflect-metadata')
const { DataSource } = require('typeorm')
const express = require('express')
const helpers = require('./helpers')
helpers.Error.handleAllException()

const db = require('./db.js')
const { models, schemas } = require('./models')
const controllers = require('./controllers')

db.entities = Object.values(schemas)
const appDataSource = new DataSource(db)
appDataSource.initialize()

const app = express()
app.use(require('cors')())
app.use(express.json())
app.use(helpers.Error.express)

app.use('/', require('./routers')(controllers(models)))

const listen = app.listen(process.env.PORT || 0, () => {
  const server = `Server 🚀 running in port: ${listen.address().port}\n`
  const database = `Database 📘 "${db.type}" running in host: ${db.host} port: ${db.port}`
  console.log(server + database)
})
