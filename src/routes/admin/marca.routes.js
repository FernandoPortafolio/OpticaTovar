const { Router } = require('express')
const { requirePermision } = require('../../middlewares/passport-local-auth')
const marca = require('../../models/marca')
const router = Router()

router.all('/marcas', requirePermision('Catalogos'))

router.get('/marcas', async (req, res) => {
  const marcas = await marca.fetchAll()
  res.render('admin/marca/table', { layout: 'admin', marcas })
})

router.get('/marcas/agregar', (req, res) => {
  res.render('admin/marca/form', {
    layout: 'admin',
    title: 'Agregar marca',
    route: '/admin/marcas/agregar',
  })
})

router.post('/marcas/agregar', function (req, res) {
  const body = req.body
  marca.createMarca(body.marca)
  res.redirect('/admin/marcas')
})

router.get('/marcas/editar', async (req, res) => {
  const id_marca = req.query.id_marca
  const _marca = await marca.readOneById(id_marca)
  console.log(_marca)
  res.render('admin/marca/form', {
    layout: 'admin',
    title: 'Editar marca',
    route: '/admin/marcas/editar',
    marca: _marca,
  })
})

router.post('/marcas/editar', async (req, res) => {
  const body = req.body
  marca.modifyMarca({ marca: body.marca, id_marca: body.id_marca })
  res.redirect('/admin/marcas')
})

router.get('/marcas/eliminar', (req, res) => {
  const id_marca = req.query.id_marca
  marca.deleteMarca(id_marca)
  res.redirect('/admin/marcas')
})

module.exports = router
