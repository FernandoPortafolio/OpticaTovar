const { Router } = require('express')
const permiso = require('../../models/permiso')
const rol = require('../../models/rol')
const rolPermiso = require('../../models/rol_permiso')

const router = Router()

router.get('/permisos', async (req, res) => {
  const permisos = await permiso.fetchAll()
  res.render('admin/rbac/permiso/table', { layout: 'admin', permisos })
})

router.get('/permisos/agregar', (req, res) => {
  res.render('admin/rbac/permiso/form', {
    layout: 'admin',
    title: 'Agregar permiso',
    route: '/admin/permisos/agregar',
  })
})

router.post('/permisos/agregar', function (req, res) {
  const body = req.body
  console.log(body)
  permiso.createPermiso(body.permiso)
  res.redirect('/admin/permisos')
})

router.get('/permisos/editar', async (req, res) => {
  const id_permiso = req.query.id_permiso
  const _permiso = await permiso.findOneById(id_permiso)
  console.log(_permiso)
  res.render('admin/rbac/permiso/form', {
    layout: 'admin',
    title: 'Editar permiso',
    route: '/admin/permisos/editar',
    permiso: _permiso,
  })
})

router.post('/permisos/editar', async (req, res) => {
  const body = req.body
  permiso.modifyPermiso({
    permiso: body.permiso,
    id_permiso: body.id_permiso,
  })
  res.redirect('/admin/permisos')
})

router.get('/permisos/eliminar', (req, res) => {
  const id_permiso = req.query.id_permiso
  permiso.deletePermiso(id_permiso)
  res.redirect('/admin/permisos')
})

//========================================================
// Asignacion de permisos
//========================================================
router.get('/permisos/asignaciones', async (req, res) => {
  const asignaciones = await rolPermiso.fetchAll()
  res.render('admin/rbac/permiso/asignaciones', {
    layout: 'admin',
    asignaciones,
  })
})

router.get('/permisos/otorgar', async (req, res) => {
  const permisos = await permiso.fetchAll()
  const roles = await rol.fetchAll()

  res.render('admin/rbac/permiso/otorgar', {
    layout: 'admin',
    route: '/admin/permisos/otorgar',
    permisos,
    roles,
  })
})

router.post('/permisos/otorgar', async (req, res) => {
  const { id_rol, id_permiso } = req.body
  try {
    await rolPermiso.asignarPermiso(id_rol, id_permiso)
  } catch (error) {
    console.error(error)
  }
  res.redirect('/admin/permisos/asignaciones')
})

router.get('/permisos/asignaciones/eliminar', async (req, res) => {
  const { id_rol, id_permiso } = req.query
  await rolPermiso.quitarPermiso(id_rol, id_permiso)
  res.redirect('/admin/permisos/asignaciones')
})

module.exports = router
