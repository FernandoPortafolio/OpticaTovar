const express = require('express')
const handlerbars = require('express-handlebars')
const path = require('path')
const settings = require('./config/settings')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')

const app = express()

//express handlebars view engine
app.set('views', path.join(__dirname, 'views'))
app.engine(
  '.hbs',
  handlerbars({
    extname: '.hbs',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    helpers: require('./helpers/helpers'),
    defaultLayout: 'main',
  })
)
app.set('view engine', 'hbs')

//middlewares
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(
  session({
    secret: settings.SECRET,
    resave: false,
    saveUninitialized: false,
  })
)
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
app.use(require('./middlewares/middlewares').captureUser)

//static files
app.use(express.static(path.join(__dirname, '../public')))

//definig routes
app.use(require('./routes/index.router'))

//init server
app.listen(settings.PORT, () =>
  console.log('Server listen on port ' + settings.PORT)
)
