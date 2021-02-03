const { connect } = require('../config/database')
class UsuarioRol {
  async asignarRol(id_usuario, id_rol) {
    const conn = await connect()
    const sql = 'INSERT into usuario_rol(id_usuario, id_rol) values (?,?)'
    const result = await conn.query(sql, [id_usuario, id_rol])
    conn.end()
    return result
  }

  async fetchAll() {
    const conn = await connect()
    const sql = `SELECT ur.id_usuario, ur.id_rol, u.correo as usuario, r.rol FROM usuario_rol ur 
    JOIN usuario u on u.id_usuario = ur.id_usuario 
    JOIN rol r on r.id_rol = ur.id_rol 
    order by ur.id_usuario, ur.id_rol`
    const result = await conn.query(sql)
    conn.end()
    return result
  }

  async quitarRol(id_usuario, id_rol) {
    const conn = await connect()
    const sql = 'DELETE from usuario_rol where id_usuario = ? and id_rol = ?'
    const result = await conn.query(sql, [id_usuario, id_rol])
    conn.end()
    return result
  }
}

module.exports = new UsuarioRol()
