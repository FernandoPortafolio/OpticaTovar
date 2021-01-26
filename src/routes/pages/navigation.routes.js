const { Router } = require('express')
const category = require('../../models/category')
const product = require('../../models/product')

const router = Router()

router.get('/', (req, res) =>
  res.render('pages/index', {
    page: 'index',
  })
)

router.get('/contacto', (req, res) =>
  res.render('pages/contacto', {
    page: 'contacto',
  })
)

router.get('/padecimientos', (req, res) =>
  res.render('pages/padecimientos', {
    page: 'padecimientos',
  })
)

router.get('/faqs', (req, res) =>
  res.render('pages/faqs', {
    page: 'faqs',
  })
)

router.get('/forma-cara', async (req, res) => {
  let corazon = await product.getProductsPerFace('corazon')
  let cuadrada = await product.getProductsPerFace('cuadrada')
  let rectangular = await product.getProductsPerFace('rectangular')
  let ovalada = await product.getProductsPerFace('ovalada')
  let redonda = await product.getProductsPerFace('redonda')
  let triangular = await product.getProductsPerFace('corazon')
  let diamante = await product.getProductsPerFace('corazon')
  res.render('pages/forma-cara', {
    corazon,
    cuadrada,
    rectangular,
    ovalada,
    redonda,
    triangular,
    diamante,
    page: 'forma-cara',
  })
})

router.get('/tienda', async (req, res) => {
  const categories = await category.fetchAll()
  res.render('pages/tienda', {
    page: 'tienda',
    categories,
  })
})

router.get('/detalle-producto', async (req, res) => {
  const id_producto = req.query.id_producto
  let producto = await product.findOneByID(id_producto)

  res.render('pages/detalle-producto', {
    page: 'detalle-producto',
    product: producto,
  })
})

router.get('/pagar', (req, res) =>
  res.render('pages/pagar', {
    page: 'pagar',
  })
)

module.exports = router
