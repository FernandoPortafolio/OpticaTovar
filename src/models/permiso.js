const { connect } = require('../config/database')
class Permiso {
  async createPermiso(permiso) {
    const sql = 'INSERT into permiso(permiso) values (?)'
    const conn = await connect()
    const result = await conn.query(sql, [permiso])
    //conn.end()
    return result
  }

  async fetchAll() {
    const sql = 'SELECT * from permiso'
    const conn = await connect()
    const result = await conn.query(sql)
    //conn.end()
    return result
  }

  async findOneById(id_permiso) {
    const sql = 'SELECT * from permiso where id_permiso=?'
    const conn = await connect()
    const result = await conn.query(sql, [id_permiso])
    //conn.end()
    return result[0]
  }

  async modifyPermiso(permiso) {
    const sql = 'UPDATE permiso set permiso = ? where id_permiso = ?'
    const conn = await connect()
    const result = await conn.query(sql, [permiso.permiso, permiso.id_permiso])
    //conn.end()
    return result
  }

  async deletePermiso(id_permiso) {
    const sql = 'DELETE from permiso where id_permiso = ?'
    const conn = await connect()
    const result = await conn.query(sql, [id_permiso])
    //conn.end()
    return result
  }
}

module.exports = new Permiso()
