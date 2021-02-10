const { Router } = require('express')
const { requirePermision } = require('../../middlewares/passport-local-auth')
const venta = require('../../models/venta')
const cliente = require('../../models/cliente')
const producto = require('../../models/product')

const router = Router()

router.all('/ventas/agregar', requirePermision('Escribir ventas'))
router.all('/ventas/editar', requirePermision('Escribir ventas'))

router.get('/ventas', requirePermision('Leer ventas'), async (req, res) => {
  const ventas = await venta.fetchAll()
  res.render('admin/venta/table', { layout: 'admin', ventas })
})

router.get('/ventas/agregar', async (req, res) => {
  const id_venta = venta.generateID()
  const clientes = await cliente.fetchAll()
  const productos = await producto.fetchAll()
  res.render('admin/venta/form', {
    layout: 'admin',
    title: 'Agregar venta',
    route: '/admin/ventas/agregar',
    id_venta,
    clientes,
    productos,
  })
})

router.post('/ventas/agregar', async function (req, res) {
  const body = req.body
  console.group('Venta nueva')
  let _venta = {
    id_venta: body.id_venta,
    fecha: body.fecha,
    id_cliente: body.id_cliente,
    status: 'COMPLETED',
  }
  let productos = []

  if (typeof body.descripcion === 'string') {
    productos.push({
      descripcion: body.descripcion,
      cantidad: body.cantidad,
      precio: body.precio,
      id_producto: body.id_producto,
    })
  } else if (typeof body.descripcion === 'object') {
    body.descripcion.forEach((descripcion, i) => {
      const cantidad = body.cantidad[i]
      const precio = body.precio[i]
      const id_producto = body.id_producto[i]
      productos.push({
        descripcion,
        cantidad,
        precio,
        id_producto,
      })
    })
  } else {
    return res.redirect('/admin/ventas')
  }

  console.log(_venta)
  console.log(productos)
  console.groupEnd()
  venta.createVentaTienda(_venta, productos)
  res.redirect('/admin/ventas')
})

router.get('/ventas/editar', async (req, res) => {
  const id_venta = req.query.id_venta

  const _venta = await venta.findOneById(id_venta)
  const vendidos = await venta.getSaleProducts(id_venta)
  const clientes = await cliente.fetchAll()
  const productos = await producto.fetchAll()
  _venta.fecha = _venta.fecha.toISOString().split('T')[0]

  console.log(_venta)
  res.render('admin/venta/form', {
    layout: 'admin',
    title: 'Editar venta',
    route: '/admin/ventas/editar',
    id_venta: _venta.id_venta,
    venta: _venta,
    clientes,
    productos,
    vendidos,
  })
})

router.post('/ventas/editar', async function (req, res) {
  const body = req.body
  console.group('Venta modificada')
  let _venta = {
    id_venta: body.id_venta,
    fecha: body.fecha,
    id_cliente: body.id_cliente,
    status: 'COMPLETED',
  }
  let productos = []

  if (typeof body.descripcion === 'string') {
    productos.push({
      descripcion: body.descripcion,
      cantidad: body.cantidad,
      precio: body.precio,
      id_producto: body.id_producto,
    })
  } else if (typeof body.descripcion === 'object') {
    body.descripcion.forEach((descripcion, i) => {
      const cantidad = body.cantidad[i]
      const precio = body.precio[i]
      const id_producto = body.id_producto[i]
      productos.push({
        descripcion,
        cantidad,
        precio,
        id_producto,
      })
    })
  } else {
    return res.redirect('/admin/ventas')
  }

  console.log(_venta)
  console.log(productos)
  console.groupEnd()
  venta.modifyVenta(_venta, productos)
  res.redirect('/admin/ventas')
})

router.get(
  '/ventas/eliminar',
  requirePermision('Eliminar ventas'),
  async (req, res) => {
    const id_venta = req.query.id_venta
    await venta.deleteVenta(id_venta)

    res.redirect('/admin/ventas')
  }
)

module.exports = router
