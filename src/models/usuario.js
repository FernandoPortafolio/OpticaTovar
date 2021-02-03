const { connect } = require('../config/database')
class Usuario {
  async findOneByEmail(email) {
    const sql = `
    SELECT id_usuario, correo, contrasena, nombre, COALESCE(foto, 'no-foto.jpg') as foto from usuario where correo = ? 
    `
    const conn = await connect()
    const user = await conn.query(sql, [email])
    return user[0]
  }

  async findOneById(id_usuario) {
    const conn = await connect()
    let sql = `
    SELECT id_usuario, correo, nombre, COALESCE(foto, 'no-foto.jpg') as foto from usuario where id_usuario = ? 
    `
    let user = await conn.query(sql, [id_usuario])
    user = user[0]
    //obtener los roles del usuario
    sql = `
    SELECT r.id_rol, r.rol FROM rol r 
                JOIN usuario_rol ur on ur.id_rol = r.id_rol
                WHERE ur.id_usuario = ?;
    `
    const roles = await conn.query(sql, [id_usuario])

    //obtener todos los permisos del usuario con base en sus roles
    sql = `
    SELECT p.permiso, p.id_permiso
                FROM permiso p
                JOIN rol_permiso rp on rp.id_permiso = p.id_permiso
                JOIN rol r on r.id_rol = rp.id_rol
                JOIN usuario_rol ur on r.id_rol = ur.id_rol
                WHERE ur.id_usuario = ?
    `
    const permisos = await conn.query(sql, [id_usuario])

    user.roles = roles
    user.permisos = permisos

    conn.end()

    return user
  }

  async fetchAll() {
    const sql =
      "SELECT id_usuario, correo, nombre, COALESCE(foto, 'no-foto.jpg') as foto FROM usuario"
    const conn = await connect()
    const result = await conn.query(sql)
    conn.end()
    return result
  }
}

module.exports = new Usuario()
