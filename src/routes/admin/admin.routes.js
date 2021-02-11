const { Router } = require('express')
const settings = require('../../config/settings')
const passport = require('passport')
const usuario = require('../../models/usuario')
const {
  isAuthenticated,
  skipLogin,
  requirePermision,
} = require('../../middlewares/passport-local-auth')

const router = Router()

//=======================================================
// Login routes
//=======================================================
router.all('/login', skipLogin)
router.get('/', (req, res) => {
  res.redirect('/admin/login')
})

router.get('/login', (req, res) => {
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
// Restore routes
//=======================================================
router.get('/login/recuperar', (req, res) => {
  res.render('admin/recuperar', { layout: 'empty' })
})

router.post('/login/recuperar', async (req, res) => {
  const correo = req.body.correo
  const user = await usuario.findOneByEmail(correo)
  if (user === undefined) {
    return res
      .status(404)
      .send('El correo electrónico que proporcionaste no está registrado')
  }

  usuario.sendRestoreEmail(user)
  res.send(
    'Se ha enviado un correo de recuperación a tu cuenta. Puedes cerrar esta pestaña'
  )
})

router.get('/login/reestablecer', async (req, res) => {
  const { token, correo } = req.query
  const isValid = await usuario.verifyToken(correo, token)
  if (!isValid)
    return res.send(
      'El vínculo ya expiró. Solicita un nuevo proceso de recuperación'
    )

  res.render('admin/reestablecer', { layout: 'empty', token, correo })
})

router.post('/login/reestablecer', async (req, res) => {
  const { correo, contrasena } = req.body
  await usuario.restorePassord(correo, contrasena)
  const vinculo = `http://${settings.HOST}:${settings.PORT}/admin/login`
  res.send(
    `<p>La contarseña ha sido cambiada. Presiona <a href='${vinculo}'>aqui</a> para iniciar sesión</p>`
  )
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
