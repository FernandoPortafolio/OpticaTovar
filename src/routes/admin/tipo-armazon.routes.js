const { Router } = require('express')
const tipo_armazon = require('../../models/tipo_armazon')
const router = Router()

router.get('/tipos_armazones', async (req, res) => {
  const tipos_armazones = await tipo_armazon.fetchAll()
  res.render('admin/tipo_armazon/table', { layout: 'admin', tipos_armazones })
})

router.get('/tipos_armazones/agregar', (req, res) => {
  res.render('admin/tipo_armazon/form', {
    layout: 'admin',
    title: 'Agregar un tipo de armazón',
    route: '/admin/tipos_armazones/agregar',
  })
})

router.post('/tipos_armazones/agregar', function (req, res) {
  const body = req.body
  tipo_armazon.createTipoArmazon(body.tipo_armazon)
  res.redirect('/admin/tipos_armazones')
})

router.get('/tipos_armazones/editar', async (req, res) => {
  const id_tipo_armazon = req.query.id_tipo_armazon
  const _tipo_armazon = await tipo_armazon.readOneById(id_tipo_armazon)
  console.log(_tipo_armazon)
  res.render('admin/tipo_armazon/form', {
    layout: 'admin',
    title: 'Editar tipo_armazon',
    route: '/admin/tipos_armazones/editar',
    tipo_armazon: _tipo_armazon,
  })
})

router.post('/tipos_armazones/editar', async (req, res) => {
  const body = req.body
  tipo_armazon.modifyTipoArmazon({
    tipo_armazon: body.tipo_armazon,
    id_tipo_armazon: body.id_tipo_armazon,
  })
  res.redirect('/admin/tipos_armazones')
})

router.get('/tipos_armazones/eliminar', (req, res) => {
  const id_tipo_armazon = req.query.id_tipo_armazon
  tipo_armazon.deleteTipoArmazon(id_tipo_armazon)
  res.redirect('/admin/tipos_armazones')
})

module.exports = router
