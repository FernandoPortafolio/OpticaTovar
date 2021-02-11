const { DB, NODE_ENV } = require('../config/settings')
const mysql = require('promise-mysql')
let connection = null

async function connect() {
  if (connection) return connection

  await createPool()
  connection.on('error', (err) => {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.log('Ha sucedido un error')
      console.log(err)
      createPool()
    }
  })
  return connection
}

async function createPool() {
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
}

module.exports = { connect }
