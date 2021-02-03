const { connect } = require('../config/database')
class RolPermiso {
  async asignarPermiso(id_rol, id_permiso) {
    const conn = await connect()
    const sql = 'INSERT into rol_permiso(id_rol, id_permiso) values (?,?)'
    const result = await conn.query(sql, [id_rol, id_permiso])
    conn.end()
    return result
  }

  async fetchAll() {
    const conn = await connect()
    const sql = `SELECT rp.id_permiso, rp.id_rol, r.rol, p.permiso   FROM rol_permiso rp 
    JOIN rol r on r.id_rol = rp.id_rol 
    JOIN permiso p on p.id_permiso = rp.id_permiso
    ORDER by rp.id_rol, rp.id_permiso`
    const result = await conn.query(sql)
    conn.end()
    return result
  }

  async quitarPermiso(id_rol, id_permiso) {
    const conn = await connect()
    const sql = 'DELETE from rol_permiso where id_permiso = ? and id_rol = ?'
    const result = await conn.query(sql, [id_permiso, id_rol])
    conn.end()
    return result
  }
}

module.exports = new RolPermiso()
