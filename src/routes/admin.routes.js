const { Router } = require('express')

const router = Router()

router.get('/', (req, res) => {
  res.redirect('admin/login')
})

router.get('/login', (req, res) => {
  res.render('admin/login', {layout: 'empty'})
})

module.exports = router
