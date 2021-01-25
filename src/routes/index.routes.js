const { Router } = require('express')
const router = Router()

//importing all routes
router.use(require('./navigation.routes'))
router.use('/api/products', require('./products.routes'))
router.use((req, res, next) => {
  res.render('404', {
    layout: '404',
  })
})

module.exports = router
