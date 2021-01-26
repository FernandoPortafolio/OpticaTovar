const { Router } = require('express')
const product = require('../../models/product')

const router = Router()

router.get('/', async (req, res) => {
  const products = await product.fetchAll()
  res.json(products)
})

router.get('/stock/:id_producto', async (req, res) => {
  const id_producto = req.params.id_producto
  const stock = await product.getStock(id_producto)
  res.json({ stock })
})

router.get('/pagination', async (req, res) => {
  const page = req.query.page
  const orderBy = req.query.orderBy
  const filter = req.query.filter

  const products = await product.showPaginate(page, orderBy, filter)

  res.json(products)
})

module.exports = router