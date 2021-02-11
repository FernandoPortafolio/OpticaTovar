const { connect } = require('../config/database')

class Forma {
  async fetchAll() {
    const conn = await connect()
    const sql = `SELECT * from forma`
    const categories = await conn.query(sql)
    //conn.end()
    return categories
  }

  async readOneById(id_forma) {
    const conn = await connect()
    const sql = `SELECT * from forma where id_forma = ?`
    const forma = await conn.query(sql, [id_forma])
    //conn.end()
    return forma[0]
  }

  async createForma(forma) {
    const conn = await connect()
    const sql = `INSERT into forma(forma) values (?)`
    const result = await conn.query(sql, [forma])
    //conn.end()
    return result
  }

  async deleteForma(id_forma) {
    const conn = await connect()
    const sql = `DELETE from forma where id_forma = ?`
    const result = await conn.query(sql, [id_forma])
    //conn.end()
    return result
  }

  async modifyForma(forma) {
    const conn = await connect()
    const sql = `UPDATE forma set forma = ? where id_forma = ?`
    const result = await conn.query(sql, [
      forma.forma,
      forma.id_forma,
    ])
    //conn.end()
    return result
  }
}

module.exports = new Forma()
