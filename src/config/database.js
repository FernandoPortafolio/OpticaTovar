const { DB } = require('../config/settings')
const mysql = require('promise-mysql')

async function connect() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    user: DB.USER,
    password: DB.PASSWORD,
    database: 'optica',
    connectionLimit: 10,
    port: '3306',
  })
  return connection
}

module.exports = { connect }
