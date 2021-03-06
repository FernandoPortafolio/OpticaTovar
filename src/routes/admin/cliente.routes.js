const { Router } = require('express')
const { requirePermision } = require('../../middlewares/passport-local-auth')
const cliente = require('../../models/cliente')
const router = Router()

router.all('/clientes/agregar', requirePermision('Escribir clientes'))
router.all('/clientes/editar', requirePermision('Escribir clientes'))

router.get('/clientes', requirePermision('Leer clientes'), async (req, res) => {
  const clientes = await cliente.fetchAll()
  res.render('admin/cliente/table', { layout: 'admin', clientes })
})

router.get('/clientes/agregar', (req, res) => {
  const _cliente = {
    id_cliente: cliente.genearteID(),
  }
  res.render('admin/cliente/form', {
    layout: 'admin',
    title: 'Agregar cliente',
    route: '/admin/clientes/agregar',
    cliente: _cliente,
  })
})

router.post('/clientes/agregar', function (req, res) {
  const body = req.body
  cliente.createCliente(body, true)
  res.redirect('/admin/clientes')
})

router.get('/clientes/editar', async (req, res) => {
  const id_cliente = req.query.id_cliente
  const _cliente = await cliente.findOneById(id_cliente)
  console.log(_cliente)
  res.render('admin/cliente/form', {
    layout: 'admin',
    title: 'Editar cliente',
    route: '/admin/clientes/editar',
    cliente: _cliente,
  })
})

router.post('/clientes/editar', async (req, res) => {
  const body = req.body
  cliente.modifyCliente(body)
  res.redirect('/admin/clientes')
})

router.get(
  '/clientes/eliminar',
  requirePermision('Eliminar clientes'),
  (req, res) => {
    const id_cliente = req.query.id_cliente
    cliente.deleteCliente(id_cliente)
    res.redirect('/admin/clientes')
  }
)

module.exports = router
