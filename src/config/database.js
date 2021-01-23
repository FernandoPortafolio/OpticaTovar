const { DB } = require('../config/settings');
const { createPool } = require('mysql2/promise');

function connect() {
  const connection = createPool({
    host: 'localhost',
    user: DB.USER,
    password: DB.PASSWORD,
    database: 'optica',
    connectionLimit: 10,
    port: '3306',
  });
  return connection;
}

module.exports = { connect };
