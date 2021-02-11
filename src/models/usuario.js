const { connect } = require('../config/database')
const { sendMail } = require('../helpers/mailer')
const settings = require('../config/settings')
const uniqid = require('uniqid')
const fs = require('fs')
const path = require('path')
const md5 = require('md5')

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

    //conn.end()

    return user
  }

  async fetchAll() {
    const sql =
      "SELECT id_usuario, correo, nombre, COALESCE(foto, 'no-foto.jpg') as foto FROM usuario"
    const conn = await connect()
    const result = await conn.query(sql)
    //conn.end()
    return result
  }

  async createUsuario(usuario, foto) {
    const conn = await connect()
    conn.beginTransaction()
    let upload
    try {
      //subir la imagen
      upload = await uploadImage(foto)

      //insertar al usuario
      let sql =
        'INSERT into usuario(correo, nombre, contrasena, foto) values (?,?,?,?)'
      const result = await conn.query(sql, [
        usuario.correo,
        usuario.nombre,
        md5(usuario.contrasena),
        upload.name,
      ])
      const insertId = result.insertId

      //darle el rol de empleado al nuevo usuario
      sql = 'INSERT into usuario_rol(id_usuario, id_rol) values (?,?)'
      await conn.query(sql, [insertId, 4])

      //enviar correo con las credenciales
      const cid = uniqid()
      const attachmentImage = {
        filename: 'logo.png',
        path: `public/assets/img/logo.png`,
        cid,
      }
      const mensaje = `
               <h1>Activación de Cuenta</h1>
               <h2>Estimado ${usuario.nombre}</h2> 
               <p>Se ha activado su cuenta para el sistema <strong>Optica Tovar</strong>. 
               Presione la siguiente imagen para ir al panel de administración</p>
               <div align='center'>
                 <a href='http://${settings.HOST}:${settings.PORT}/admin/login'>
                    <img src='cid:${cid}' height='100'>
                    <p>Presione aqui</p>
                 </a>
               </div>
               <p>Sus credenciales de acceso son:</p>
               <p><b>Usuario:</b> ${usuario.correo} </p>
               <p><b>Contraseña:</b> ${usuario.contrasena} </p>`

      sendMail(usuario.correo, 'Se ha creado una cuenta para usted', mensaje, [
        attachmentImage,
      ])

      conn.commit()
    } catch (error) {
      console.error(error)
      conn.rollback()
      deleteImage(upload.name)
    }
    //conn.end()
  }

  async modifyUsuario(usuario, foto) {
    const conn = await connect()
    conn.beginTransaction()
    let upload = null
    try {
      upload = await uploadImage(foto)
      let sql = ''
      let params = []
      if (usuario.contrasena) {
        if (upload.ok) {
          sql =
            'UPDATE usuario set correo = ?, contrasena = ?, nombre = ?, foto = ? where id_usuario = ?'
          params = [
            usuario.correo,
            md5(usuario.contrasena),
            usuario.nombre,
            upload.name,
            usuario.id_usuario,
          ]
        } else {
          sql =
            'UPDATE usuario set correo = ?, contrasena = ?, nombre = ? where id_usuario = ?'
          params = [
            usuario.correo,
            md5(usuario.contrasena),
            usuario.nombre,
            usuario.id_usuario,
          ]
        }
      } else if (upload.ok) {
        sql =
          'UPDATE usuario set correo = ?, nombre = ?, foto = ?  where id_usuario = ?'
        params = [
          usuario.correo,
          usuario.nombre,
          upload.name,
          usuario.id_usuario,
        ]
      } else {
        sql = 'UPDATE usuario set correo = ?, nombre = ?  where id_usuario = ?'
        params = [usuario.correo, usuario.nombre, usuario.id_usuario]
      }
      await conn.query(sql, params)
      if (upload.ok) {
        const old = await this.findOneById(usuario.id_usuario)
        deleteImage(old.foto)
      }
      conn.commit()
    } catch (error) {
      console.error(error)
      conn.rollback()
      deleteImage(upload.name)
    }
    //conn.end()
  }

  async deleteUsuario(id_usuario) {
    const old = await this.findOneById(id_usuario)
    try {
      const sql = 'DELETE from usuario where id_usuario = ?'
      const conn = await connect()
      await conn.query(sql, [id_usuario])
      deleteImage(old.foto)
    } catch (error) {
      console.log(error)
    }
  }

  async sendRestoreEmail(user) {
    try {
      const token = uniqid().substring(0, 16)

      const sql = 'UPDATE usuario set token = ? where correo = ?'
      const conn = await connect()
      await conn.query(sql, [token, user.correo])

      const vinculo = `http://${settings.HOST}:${settings.PORT}/admin/login/reestablecer?token=${token}&correo=${user.correo}`
      const mensaje = `
    <h1>Recuperación de contraseña</h1>
    <h2>Estimado ${user.nombre}</h2> 
    <p>Se ha solicitado una recuperación de contraseña para su cuenta en Óptica Tovar</strong>. 
    Presione el siguiente vínculo para reestablecer una nueva contraseña:</p>
    <div align='center'>
      <a href=${vinculo}>Reestablecer mi contraseña</a>
    </div>
    <p>Si usted no ha solicitado esta acción ignore este mensaje.</p>`

      sendMail(user.correo, 'Recuperación de contraseña', mensaje)
    } catch (error) {
      console.error(error)
    }
  }

  async verifyToken(correo, token) {
    let isValid = false
    try {
      const conn = await connect()
      const sql = 'SELECT * from usuario where correo = ? and token = ?'
      const result = await conn.query(sql, [correo, token])
      isValid = result[0] !== undefined
      //conn.end()
    } catch (error) {
      console.error(error)
    }
    return isValid
  }

  async restorePassord(correo, newPassword) {
    try {
      const conn = await connect()
      const sql =
        'UPDATE usuario SET contrasena = ?, token = null WHERE correo = ?'
      await conn.query(sql, [md5(newPassword), correo])
      //conn.end()
    } catch (error) {
      console.error(error)
    }
  }
}

async function uploadImage(foto) {
  if (!foto) return { ok: false }

  const validTypes = ['jpg', 'jpeg', 'png', 'gif']
  const type = foto.mimetype.split('/')[1]
  const newName = `${uniqid().substring(0, 13)}.${type}`
  console.log('New name: ' + newName)
  if (validTypes.includes(type)) {
    try {
      await foto.mv(`public/img/usuarios/${newName}`)
      return { ok: true, name: newName }
    } catch (error) {
      console.log(error)
    }
  }

  return { ok: false }
}

function deleteImage(imageName) {
  let imagePath = path.resolve(`public/img/usuarios/${imageName}`)
  if (fs.existsSync(imagePath) && imageName !== 'no-foto.jpg') {
    fs.unlinkSync(imagePath)
    console.log('Image deleted, was: ', imageName)
  } else {
    console.log('la imagen no existe en: ', imagePath)
  }
}

module.exports = new Usuario()
