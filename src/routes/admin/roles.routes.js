const { Router } = require('express')
const rol = require('../../models/rol')
const usuario = require('../../models/usuario')
const usuarioRol = require('../../models/usuario_rol')

const router = Router()

router.get('/roles', async (req, res) => {
  const roles = await rol.fetchAll()
  res.render('admin/rbac/rol/table', { layout: 'admin', roles })
})

router.get('/roles/agregar', (req, res) => {
  res.render('admin/rbac/rol/form', {
    layout: 'admin',
    title: 'Agregar rol',
    route: '/admin/roles/agregar',
  })
})

router.post('/roles/agregar', function (req, res) {
  const body = req.body
  console.log(body)
  rol.createRol(body.rol)
  res.redirect('/admin/roles')
})

router.get('/roles/editar', async (req, res) => {
  const id_rol = req.query.id_rol
  const _rol = await rol.findOneById(id_rol)
  console.log(_rol)
  res.render('admin/rbac/rol/form', {
    layout: 'admin',
    title: 'Editar rol',
    route: '/admin/roles/editar',
    rol: _rol,
  })
})

router.post('/roles/editar', async (req, res) => {
  const body = req.body
  rol.modifyRol({
    rol: body.rol,
    id_rol: body.id_rol,
  })
  res.redirect('/admin/roles')
})

router.get('/roles/eliminar', (req, res) => {
  const id_rol = req.query.id_rol
  rol.deleteRol(id_rol)
  res.redirect('/admin/roles')
})

//========================================================
// Asignacion de roles
//========================================================
router.get('/roles/asignaciones', async (req, res) => {
  const asignaciones = await usuarioRol.fetchAll()
  res.render('admin/rbac/rol/asignaciones', {
    layout: 'admin',
    asignaciones,
  })
})

router.get('/roles/otorgar', async (req, res) => {
  const roles = await rol.fetchAll()
  const usuarios = await usuario.fetchAll()

  res.render('admin/rbac/rol/otorgar', {
    layout: 'admin',
    route: '/admin/roles/otorgar',
    roles,
    usuarios,
  })
})

router.post('/roles/otorgar', async (req, res) => {
  const { id_rol, id_usuario } = req.body
  try {
    await usuarioRol.asignarRol(id_usuario, id_rol)
  } catch (error) {
    console.error(error)
  }
  res.redirect('/admin/roles/asignaciones')
})

router.get('/roles/asignaciones/eliminar', async (req, res) => {
  const { id_rol, id_usuario } = req.query
  await usuarioRol.quitarRol(id_usuario, id_rol)
  res.redirect('/admin/roles/asignaciones')
})

module.exports = router
