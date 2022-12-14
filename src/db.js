const { checkBool } = require('./utils')

const sync = checkBool(process.env.DB_SYNCHRONIZE)
const log = checkBool(process.env.DB_LOGGING)

module.exports = {
  type: process.env.DB_TYPE,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [],
  synchronize: sync === null ? true : sync,
  logging: log === null ? false : log
}
