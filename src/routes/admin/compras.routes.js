const { Router } = require('express')
const { requirePermision } = require('../../middlewares/passport-local-auth')
const compra = require('../../models/compra')
const proveedor = require('../../models/proveedor')
const producto = require('../../models/product')
const router = Router()

router.all('/compras/agregar', requirePermision('Escribir compras'))
router.all('/compras/editar', requirePermision('Escribir compras'))

router.get('/compras', requirePermision('Leer compras'), async (req, res) => {
  const compras = await compra.fetchAll()
  res.render('admin/compra/table', { layout: 'admin', compras })
})

router.get('/compras/agregar', async (req, res) => {
  const folio = compra.generateFolio()
  const proveedores = await proveedor.fetchAll()
  const productos = await producto.fetchAll()
  res.render('admin/compra/form', {
    layout: 'admin',
    title: 'Agregar compra',
    route: '/admin/compras/agregar',
    folio,
    proveedores,
    productos,
  })
})

router.post('/compras/agregar', async function (req, res) {
  const body = req.body
  let _compra = {
    folio: body.folio,
    fecha: body.fecha,
    id_proveedor: body.id_proveedor,
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
    return res.redirect('/admin/compras')
  }

  await compra.createCompra(_compra, productos)
  res.redirect('/admin/compras')
})

router.get('/compras/editar', async (req, res) => {
  const id_compra = req.query.id_compra

  const _compra = await compra.readOneById(id_compra)
  const comprados = await compra.findProductosCompra(id_compra)
  const proveedores = await proveedor.fetchAll()
  const productos = await producto.fetchAll()
  _compra.fecha = _compra.fecha.toISOString().split('T')[0]

  res.render('admin/compra/form', {
    layout: 'admin',
    title: 'Editar compra',
    route: '/admin/compras/editar',
    folio: _compra.folio,
    compra: _compra,
    proveedores,
    productos,
    comprados,
  })
})

router.post('/compras/editar', async function (req, res) {
  const body = req.body
  let _compra = {
    folio: body.folio,
    fecha: body.fecha,
    id_proveedor: body.id_proveedor,
    id_compra: body.id_compra,
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
    return res.redirect('/admin/compras')
  }

  await compra.modifyCompra(_compra, productos)
  res.redirect('/admin/compras')
})

router.get(
  '/compras/eliminar',
  requirePermision('Eliminar compras'),
  async (req, res) => {
    const id_compra = req.query.id_compra
    await compra.deleteCompra(id_compra)

    res.redirect('/admin/compras')
  }
)

module.exports = router
