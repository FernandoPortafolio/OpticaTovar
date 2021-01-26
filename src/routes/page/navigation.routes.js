const { Router } = require('express')
const Category = require('../../models/category.model')
const Product = require('../../models/product.model')

const router = Router()

router.get('/', (req, res) =>
  res.render('page/index', {
    page: 'index',
  })
)

router.get('/contacto', (req, res) =>
  res.render('page/contacto', {
    page: 'contacto',
  })
)

router.get('/padecimientos', (req, res) =>
  res.render('page/padecimientos', {
    page: 'padecimientos',
  })
)

router.get('/faqs', (req, res) =>
  res.render('page/faqs', {
    page: 'faqs',
  })
)

router.get('/forma-cara', async (req, res) => {
  const product = new Product()
  let corazon = await product.getProductsPerFace('corazon')
  let cuadrada = await product.getProductsPerFace('cuadrada')
  let rectangular = await product.getProductsPerFace('rectangular')
  let ovalada = await product.getProductsPerFace('ovalada')
  let redonda = await product.getProductsPerFace('redonda')
  let triangular = await product.getProductsPerFace('corazon')
  let diamante = await product.getProductsPerFace('corazon')
  res.render('page/forma-cara', {
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
  const category = new Category()
  const categories = await category.getCAtegories()
  res.render('page/tienda', {
    page: 'tienda',
    categories,
  })
})

router.get('/detalle-producto', async (req, res) => {
  const id_producto = req.query.id_producto
  let product = new Product()
  product = await product.findOneByID(id_producto)

  res.render('page/detalle-producto', {
    page: 'detalle-producto',
    product: product[0],
  })
})

router.get('/pagar', (req, res) =>
  res.render('page/pagar', {
    page: 'pagar',
  })
)

module.exports = router
