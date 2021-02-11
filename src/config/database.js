const { DB, NODE_ENV } = require('../config/settings')
const mysql = require('promise-mysql')

async function connect() {
  let connection = null
  if (NODE_ENV === 'dev') {
    connection = await mysql.createConnection({
      host: DB.HOST,
      user: DB.USER,
      password: DB.PASSWORD,
      database: DB.DATABASE,
      port: DB.PORT,
      connectionLimit: 10,
    })
  } else {
    connection = await mysql.createConnection(process.env.CLEARDB_DATABASE_URL)
  }

  return connection
}
module.exports = { connect }
