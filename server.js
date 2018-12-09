const express = require('express');
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const flash = require('express-flash-messages');
const validator = require('express-validator');

mongoose.connect('mongodb://localhost:27017/logindb', {
//    useMongoClient: true
    useNewUrlParser: true
});
mongoose.Promise = global.Promise;

const app = express();

//static files
app.use(express.static('public'));

app.use(session({
    secret: 'sfdgjidukejjzxduzdljadfkjds',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
require('./passportconfig').configure(passport);

//body parser
app.use(bodyParser.urlencoded({extended: false}));

//validator
app.use(validator());

//mustache
const mustache = mustacheExpress();
mustache.cache = null;

app.engine('mustache', mustache);
app.set('view engine', 'mustache');

app.use(require('./routes/general'));
app.use(require('./routes/auth'));

app.listen(3000, function() {
    console.log('Listening at port 3000');
})