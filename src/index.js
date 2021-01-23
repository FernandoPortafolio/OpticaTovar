const express = require('express');
const handlerbars = require('express-handlebars');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const settings = require('./config/settings');

const app = express();

//express handlebars view engine
app.set('views', path.join(__dirname, 'views'));
app.engine(
  '.hbs',
  handlerbars({
    extname: '.hbs',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    helpers: require('./helpers/helpers'),
    defaultLayout: 'main',
  })
);
app.set('view engine', 'hbs');

//middlewares
// app.use(morgan('dev'));
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//static files
app.use(express.static(path.join(__dirname, '../public')));

//definig routes
app.use(require('./routes/index.routes'));

//init server
app.listen(settings.PORT, () =>
  console.log('Server listen on port ' + settings.PORT)
);
