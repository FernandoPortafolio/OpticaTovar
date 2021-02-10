const { Router } = require('express')
const passport = require('passport')
const {
  isAuthenticated,
  skipLogin,
  requirePermision,
} = require('../../middlewares/passport-local-auth')

const router = Router()

//=======================================================
// Login routes
//=======================================================
router.get('/', (req, res) => {
  res.redirect('/admin/login')
})

router.get('/login', skipLogin, (req, res) => {
  const message = req.flash('message')[0]
  res.render('admin/login', { layout: 'empty', message })
})

router.post(
  '/login',
  passport.authenticate('local-auth', {
    successRedirect: '/admin/dashboard',
    failureRedirect: '/admin/login',
    passReqToCallback: true,
  })
)

router.get('/logout', (req, res) => {
  req.logOut()
  res.redirect('login')
})

//=======================================================
// Navigation routes
//=======================================================
router.use(isAuthenticated)
router.get('/dashboard', requirePermision('Dashboard'), (req, res) => {
  res.render('admin/dashboard', { layout: 'admin', page: 'dashboard' })
})

router.use(require('./marca.routes'))
router.use(require('./category.routes'))
router.use(require('./forma.routes'))
router.use(require('./tipo-armazon.routes'))

router.use(require('./products.routes'))
router.use(require('./proveedor.routes'))
router.use(require('./cliente.routes'))
router.use(require('./compras.routes'))
router.use(require('./ventas.routes'))

//de aqui en adelante si puedo verificar de jalon cruge porque son las ultimas rutas
//recordar que las rutas se van procesando secuencialmente, al igual que los middlewares
router.use(requirePermision('Cruge'))
router.use(require('./roles.routes'))
router.use(require('./permisos.routes'))
router.use(require('./usuarios.routes'))

module.exports = router
