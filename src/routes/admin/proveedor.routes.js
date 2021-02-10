const { Router } = require('express')
const { requirePermision } = require('../../middlewares/passport-local-auth')
const proveedor = require('../../models/proveedor')

const router = Router()

router.all('/proveedores/agregar', requirePermision('Escribir proveedores'))
router.all('/proveedores/editar', requirePermision('Escribir proveedores'))

router.get(
  '/proveedores',
  requirePermision('Leer proveedores'),
  async (req, res) => {
    const proveedores = await proveedor.fetchAll()
    res.render('admin/proveedor/table', { layout: 'admin', proveedores })
  }
)

router.get('/proveedores/agregar', (req, res) => {
  res.render('admin/proveedor/form', {
    layout: 'admin',
    title: 'Agregar proveedor',
    route: '/admin/proveedores/agregar',
  })
})

router.post('/proveedores/agregar', function (req, res) {
  const body = req.body
  proveedor.createProveedor(body)
  res.redirect('/admin/proveedores')
})

router.get('/proveedores/editar', async (req, res) => {
  const id_proveedor = req.query.id_proveedor
  const _proveedor = await proveedor.readOneById(id_proveedor)
  res.render('admin/proveedor/form', {
    layout: 'admin',
    title: 'Editar proveedor',
    route: '/admin/proveedores/editar',
    proveedor: _proveedor,
  })
})

router.post('/proveedores/editar', async (req, res) => {
  const body = req.body
  proveedor.modifyProveedor(body)
  res.redirect('/admin/proveedores')
})

router.get(
  '/proveedores/eliminar',
  requirePermision('Eliminar proveedores'),
  (req, res) => {
    const id_proveedor = req.query.id_proveedor
    proveedor.deleteProveedor(id_proveedor)
    res.redirect('/admin/proveedores')
  }
)

module.exports = router
