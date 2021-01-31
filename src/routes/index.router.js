const { Router } = require('express')
const router = Router()

//importing all routes
router.use(require('./pages/navigation.routes'))
router.use('/admin', require('./admin/admin.routes'))
router.use('/api/products', require('./api/products.routes'))
router.use('/api/ventas', require('./api/ventas.routes'))

//404 middleware
router.use((req, res, next) => {
  res.render('404', {
    layout: '404',
  })
})

module.exports = router
