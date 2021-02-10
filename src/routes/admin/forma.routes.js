const { Router } = require('express')
const { requirePermision } = require('../../middlewares/passport-local-auth')
const forma = require('../../models/forma')
const router = Router()

router.all('/formas', requirePermision('Catalogos'))

router.get('/formas', async (req, res) => {
  const formas = await forma.fetchAll()
  res.render('admin/forma/table', { layout: 'admin', formas })
})

router.get('/formas/agregar', (req, res) => {
  res.render('admin/forma/form', {
    layout: 'admin',
    title: 'Agregar forma',
    route: '/admin/formas/agregar',
  })
})

router.post('/formas/agregar', function (req, res) {
  const body = req.body
  forma.createForma(body.forma)
  res.redirect('/admin/formas')
})

router.get('/formas/editar', async (req, res) => {
  const id_forma = req.query.id_forma
  const _forma = await forma.readOneById(id_forma)
  console.log(_forma)
  res.render('admin/forma/form', {
    layout: 'admin',
    title: 'Editar forma',
    route: '/admin/formas/editar',
    forma: _forma,
  })
})

router.post('/formas/editar', async (req, res) => {
  const body = req.body
  forma.modifyForma({
    forma: body.forma,
    id_forma: body.id_forma,
  })
  res.redirect('/admin/formas')
})

router.get('/formas/eliminar', (req, res) => {
  const id_forma = req.query.id_forma
  forma.deleteForma(id_forma)
  res.redirect('/admin/formas')
})

module.exports = router
