const { connect } = require('../config/database')
class Marca {
  async fetchAll() {
    const conn = await connect()
    const sql = `SELECT * from marca order by marca`
    const marcas = await conn.query(sql)
    //conn.end()
    return marcas
  }

  async readOneById(id_marca) {
    const conn = await connect()
    const sql = `SELECT * from marca where id_marca = ?`
    const marca = await conn.query(sql, [id_marca])
    //conn.end()
    return marca[0]
  }

  async createMarca(marca) {
    const conn = await connect()
    const sql = `INSERT into marca(marca) values (?)`
    const result = await conn.query(sql, [marca])
    //conn.end()
    return result
  }

  async deleteMarca(id_marca) {
    const conn = await connect()
    const sql = `DELETE from marca where id_marca = ?`
    const result = await conn.query(sql, [id_marca])
    //conn.end()
    return result
  }

  async modifyMarca(marca) {
    const conn = await connect()
    const sql = `UPDATE marca set marca = ? where id_marca = ?`
    const result = await conn.query(sql, [marca.marca, marca.id_marca])
    //conn.end()
    return result
  }
}

module.exports = new Marca()
