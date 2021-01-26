const { Router } = require('express')
const passport = require('passport')
const {
  isAuthenticated,
  skipLogin,
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
router.get('/dashboard', (req, res) => {
  res.render('admin/dashboard', { layout: 'admin', page: 'dashboard' })
})

router.use(require('./marca.routes'))
router.use(require('./category.routes'))
router.use(require('./forma.routes'))
router.use(require('./tipo-armazon.routes'))

module.exports = router