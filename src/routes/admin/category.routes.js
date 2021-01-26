const { Router } = require('express')
const categoria = require('../../models/category')
const router = Router()

router.get('/categorias', async (req, res) => {
  const categorias = await categoria.fetchAll()
  res.render('admin/categoria/table', { layout: 'admin', categorias })
})

router.get('/categorias/agregar', (req, res) => {
  res.render('admin/categoria/form', {
    layout: 'admin',
    title: 'Agregar categoria',
    route: '/admin/categorias/agregar',
  })
})

router.post('/categorias/agregar', function (req, res) {
  const body = req.body
  categoria.createCategoria(body.categoria)
  res.redirect('/admin/categorias')
})

router.get('/categorias/editar', async (req, res) => {
  const id_categoria = req.query.id_categoria
  const _categoria = await categoria.readOneById(id_categoria)
  console.log(_categoria)
  res.render('admin/categoria/form', {
    layout: 'admin',
    title: 'Editar categoria',
    route: '/admin/categorias/editar',
    categoria: _categoria,
  })
})

router.post('/categorias/editar', async (req, res) => {
  const body = req.body
  categoria.modifyCategoria({
    categoria: body.categoria,
    id_categoria: body.id_categoria,
  })
  res.redirect('/admin/categorias')
})

router.get('/categorias/eliminar', (req, res) => {
  const id_categoria = req.query.id_categoria
  categoria.deleteCategoria(id_categoria)
  res.redirect('/admin/categorias')
})

module.exports = router
