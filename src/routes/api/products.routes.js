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

router.get('/price/:id_producto', async (req, res) => {
  const id_producto = req.params.id_producto
  const producto = await product.findOneByID(id_producto)
  res.json({ price: producto.precio })
})

router.get('/pagination', async (req, res) => {
  const page = req.query.page
  const orderBy = req.query.orderBy
  const filter = req.query.filter

  const products = await product.showPaginate(page, orderBy, filter)

  res.json(products)
})

router.get('/sales/:type', async (req, res) => {
  const type = req.params.type
  switch (type) {
    case 'month':
      const sales = await product.getSalesByMonth()
      res.json({ sales })
      break

    case 'place':
      const { sales_store, sales_page } = await product.getSalesByPlace()
      res.json({ sales_store, sales_page })
      break

    default:
      res.json({ err: 'type is only month or place' })
      break
  }
})

module.exports = router
