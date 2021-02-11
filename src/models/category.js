const { connect } = require('../config/database')

class Category {
  async fetchAll() {
    const conn = await connect()
    const sql = `SELECT * from categoria`
    const categories = await conn.query(sql)
    //conn.end()
    return categories
  }

  async readOneById(id_categoria) {
    const conn = await connect()
    const sql = `SELECT * from categoria where id_categoria = ?`
    const categoria = await conn.query(sql, [id_categoria])
    //conn.end()
    return categoria[0]
  }

  async createCategoria(categoria) {
    const conn = await connect()
    const sql = `INSERT into categoria(categoria) values (?)`
    const result = await conn.query(sql, [categoria])
    //conn.end()
    return result
  }

  async deleteCategoria(id_categoria) {
    const conn = await connect()
    const sql = `DELETE from categoria where id_categoria = ?`
    const result = await conn.query(sql, [id_categoria])
    //conn.end()
    return result
  }

  async modifyCategoria(categoria) {
    const conn = await connect()
    const sql = `UPDATE categoria set categoria = ? where id_categoria = ?`
    const result = await conn.query(sql, [
      categoria.categoria,
      categoria.id_categoria,
    ])
    //conn.end()
    return result
  }
}

module.exports = new Category()
