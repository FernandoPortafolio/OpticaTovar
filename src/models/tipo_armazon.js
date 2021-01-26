const { connect } = require('../config/database')

class TipoArmazon {
  async fetchAll() {
    const conn = await connect()
    const sql = `SELECT * from tipo_armazon`
    const categories = await conn.query(sql)
    conn.end()
    return categories
  }

  async readOneById(id_tipo_armazon) {
    const conn = await connect()
    const sql = `SELECT * from tipo_armazon where id_tipo_armazon = ?`
    const tipo_armazon = await conn.query(sql, [id_tipo_armazon])
    conn.end()
    return tipo_armazon[0]
  }

  async createTipoArmazon(tipo_armazon) {
    const conn = await connect()
    const sql = `INSERT into tipo_armazon(tipo_armazon) values (?)`
    const result = await conn.query(sql, [tipo_armazon])
    conn.end()
    return result
  }

  async deleteTipoArmazon(id_tipo_armazon) {
    const conn = await connect()
    const sql = `DELETE from tipo_armazon where id_tipo_armazon = ?`
    const result = await conn.query(sql, [id_tipo_armazon])
    conn.end()
    return result
  }

  async modifyTipoArmazon(tipo_armazon) {
    const conn = await connect()
    const sql = `UPDATE tipo_armazon set tipo_armazon = ? where id_tipo_armazon = ?`
    const result = await conn.query(sql, [
      tipo_armazon.tipo_armazon,
      tipo_armazon.id_tipo_armazon,
    ])
    conn.end()
    return result
  }
}

module.exports = new TipoArmazon()
