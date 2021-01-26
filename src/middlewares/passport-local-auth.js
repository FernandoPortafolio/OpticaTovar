const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const usuario = require('../models/usuario')
const md5 = require('md5')

passport.serializeUser((user, done) => {
  done(null, user.id_usuario)
})

passport.deserializeUser(async (id, done) => {
  const user = await usuario.findOneById(id)
  done(null, user)
})

passport.use(
  'local-auth',
  new LocalStrategy(
    {
      usernameField: 'correo',
      passwordField: 'contrasena',
      passReqToCallback: true,
    },
    async (req, correo, contrasena, done) => {
      try {
        const user = await usuario.findOneByEmail(correo)
        if (user) {
          const passEncrypted = md5(contrasena)
          if (user.contrasena === passEncrypted) {
            return done(null, user)
          }
        }

        return done(null, false, req.flash('message', 'Incorrect credentials'))
      } catch (error) {
        done(error)
      }
    }
  )
)

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('login')
}

function skipLogin(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('dashboard')
  }
  return next()
}

module.exports = {
  isAuthenticated,
  skipLogin,
}
