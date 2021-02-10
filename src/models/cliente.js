const { connect } = require('../config/database')
const uniqid = require('uniqid')

class Cliente {
  async fetchAll() {
    const sql = 'SELECT * from cliente'
    const conn = await connect()
    const result = await conn.query(sql)
    conn.end()
    return result
  }

  async findOneById(id_cliente) {
    const sql = 'SELECT * from cliente where id_cliente = ?'
    const conn = await connect()
    const result = await conn.query(sql, [id_cliente])
    conn.end()
    return result[0]
  }

  async deleteCliente(id_cliente) {
    const sql = 'DELETE from cliente  WHERE id_cliente = ?'
    const conn = await connect()
    const result = await conn.query(sql, [id_cliente])
    conn.end()
    return result
  }

  async createCliente(cliente, isManual, connection) {
    let result = null
    const tipo = isManual ? 'Manual' : 'Paypal'
    const sql =
      'INSERT INTO cliente(id_cliente, email, nombre, apellido, calle, colonia, ciudad, cod_postal, tipo) VALUES (?,?,?,?,?,?,?,?,?)'
    const params = [
      cliente.id_cliente,
      cliente.email,
      cliente.nombre,
      cliente.apellido,
      cliente.calle,
      cliente.colonia,
      cliente.ciudad,
      cliente.cod_postal,
      tipo,
    ]
    if (isManual) {
      const conn = await connect()
      result = await conn.query(sql, params)
      conn.end()
    } else {
      result = await connection.query(sql, params)
    }

    return result
  }

  async modifyCliente(cliente) {
    const sql =
      'UPDATE cliente SET email = ?, nombre = ?, apellido = ?, calle = ?, colonia = ?, ciudad = ?, cod_postal = ?  WHERE id_cliente = ?'
    const conn = await connect()
    const result = await conn.query(sql, [
      cliente.email,
      cliente.nombre,
      cliente.apellido,
      cliente.calle,
      cliente.colonia,
      cliente.ciudad,
      cliente.cod_postal,
      cliente.id_cliente,
    ])
    conn.end()
    return result
  }

  async existCliente() {
    const sql = 'SELECT * from cliente where id_cliente = ?'
    const conn = await connect()
    const result = await conn.query(sql, [id_cliente])
    console.log(result)
    conn.end()
    return result
  }

  genearteID() {
    return uniqid().substring(0, 13).toUpperCase()
  }
}

module.exports = new Cliente()
