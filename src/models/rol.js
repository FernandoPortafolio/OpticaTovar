const { connect } = require('../config/database')
class Rol {
  async createRol(rol) {
    const sql = 'INSERT into rol(rol) values (?)'
    const conn = await connect()
    const result = await conn.query(sql, [rol])
    //conn.end()
    return result
  }

  async fetchAll() {
    const sql = 'SELECT * from rol'
    const conn = await connect()
    const result = await conn.query(sql)
    //conn.end()
    return result
  }

  async findOneById(id_rol) {
    const sql = 'SELECT * from rol where id_rol=?'
    const conn = await connect()
    const result = await conn.query(sql, [id_rol])
    //conn.end()
    return result[0]
  }

  async modifyRol(rol) {
    const sql = 'UPDATE rol set rol = ? where id_rol = ?'
    const conn = await connect()
    const result = await conn.query(sql, [rol.rol, rol.id_rol])
    //conn.end()
    return result
  }

  async deleteRol(id_rol) {
    const sql = 'DELETE from rol where id_rol = ?'
    const conn = await connect()
    const result = await conn.query(sql, [id_rol])
    //conn.end()
    return result
  }
}

module.exports = new Rol()
