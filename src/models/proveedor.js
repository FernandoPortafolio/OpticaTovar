const { connect } = require('../config/database')
class Proveedor {
  async fetchAll() {
    const sql = 'SELECT * from proveedor'
    const conn = await connect()
    const result = await conn.query(sql)
    //conn.end()
    return result
  }

  async readOneById(id_proveedor) {
    const sql = 'SELECT * from proveedor where id_proveedor = ?'
    const conn = await connect()
    const result = await conn.query(sql, [id_proveedor])
    //conn.end()
    return result[0]
  }

  async createProveedor(proveedor) {
    const sql =
      'INSERT into proveedor(razon_social, rfc, domicilio, telefono) values (?,?,?,?)'
    const conn = await connect()
    const result = await conn.query(sql, [
      proveedor.razon_social,
      proveedor.rfc,
      proveedor.domicilio,
      proveedor.telefono,
    ])
    //conn.end()
    return result
  }

  async deleteProveedor(id_proveedor) {
    const sql = 'DELETE from proveedor where id_proveedor = ?'
    const conn = await connect()
    const result = await conn.query(sql, [id_proveedor])
    //conn.end()
    return result
  }

  async modifyProveedor(proveedor) {
    const sql =
      'UPDATE proveedor set razon_social = ?, rfc = ?, domicilio = ?, telefono = ? where id_proveedor = ?'
    const conn = await connect()
    const result = await conn.query(sql, [
      proveedor.razon_social,
      proveedor.rfc,
      proveedor.domicilio,
      proveedor.telefono,
      proveedor.id_proveedor,
    ])
    //conn.end()
    return result
  }
}

module.exports = new Proveedor()
