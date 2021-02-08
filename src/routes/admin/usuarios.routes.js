const { Router } = require('express')
const usuario = require('../../models/usuario')

const router = Router()

router.get('/usuarios', async (req, res) => {
  const usuarios = await usuario.fetchAll()
  res.render('admin/rbac/usuario/table', {
    layout: 'admin',
    usuarios,
  })
})

router.get('/usuarios/agregar', (req, res) => {
  res.render('admin/rbac/usuario/form', {
    layout: 'admin',
    title: 'Agregar usuario',
    route: '/admin/usuarios/agregar',
  })
})

router.post('/usuarios/agregar', async (req, res) => {
  const body = req.body
  const foto = req.files?.foto
  await usuario.createUsuario(body, foto)
  res.redirect('/admin/usuarios/')
})

router.get('/usuarios/editar', async (req, res) => {
  const id_usuario = req.query.id_usuario
  const _usuario = await usuario.findOneById(id_usuario)
  console.log(_usuario)
  res.render('admin/rbac/usuario/form', {
    layout: 'admin',
    title: 'Agregar usuario',
    route: '/admin/usuarios/editar',
    title: 'Editar usuario',
    usuario: _usuario,
  })
})

router.post('/usuarios/editar', async (req, res) => {
  const body = req.body
  const foto = req.files?.foto
  await usuario.modifyUsuario(body, foto)
  res.redirect('/admin/usuarios/')
})

router.get('/usuarios/eliminar', async (req, res) => {
  const id_usuario = req.query.id_usuario
  await usuario.deleteUsuario(id_usuario)
  res.redirect('/admin/usuarios')
})

module.exports = router
