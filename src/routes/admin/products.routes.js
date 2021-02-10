const { Router } = require('express')
const { requirePermision } = require('../../middlewares/passport-local-auth')
const product = require('../../models/product')
const marca = require('../../models/marca')
const categoria = require('../../models/category')
const forma = require('../../models/forma')
const tipo = require('../../models/tipo_armazon')
const router = Router()

router.all('/productos', requirePermision('Productos'))

router.get('/inventario', requirePermision('Inventario'), async (req, res) => {
  const inventario = await product.getInventario()
  res.render('admin/inventario/table', { layout: 'admin', inventario })
})

router.get('/productos', async (req, res) => {
  const productos = await product.fetchAll()
  res.render('admin/producto/table', { layout: 'admin', productos })
})

router.get('/productos/agregar', async (req, res) => {
  const marcas = await marca.fetchAll()
  const tipos = await tipo.fetchAll()
  const formas = await forma.fetchAll()
  const categorias = await categoria.fetchAll()
  res.render('admin/producto/form', {
    layout: 'admin',
    title: 'Agregar producto',
    route: '/admin/productos/agregar',
    marcas,
    tipos,
    formas,
    categorias,
  })
})

router.post('/productos/agregar', async function (req, res) {
  const body = req.body
  const foto = req.files?.foto
  await product.createProduct(body, foto)
  res.redirect('/admin/productos')
})

router.get('/productos/editar', async (req, res) => {
  const id_producto = req.query.id_producto
  const _producto = await product.findOneByID(id_producto)
  const marcas = await marca.fetchAll()
  const tipos = await tipo.fetchAll()
  const formas = await forma.fetchAll()
  const categorias = await categoria.fetchAll()
  console.log(_producto)
  res.render('admin/producto/form', {
    layout: 'admin',
    title: 'Editar producto',
    route: '/admin/productos/editar',
    producto: _producto,
    marcas,
    tipos,
    formas,
    categorias,
  })
})

router.post('/productos/editar', async (req, res) => {
  const body = req.body
  const foto = req.files?.foto
  await product.modifyProduct(body, foto)
  res.redirect('/admin/productos')
})

router.get('/productos/eliminar', (req, res) => {
  const id_producto = req.query.id_producto
  product.deleteProduct(id_producto)
  res.redirect('/admin/productos')
})

module.exports = router
