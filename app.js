// dependencies
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const config = require('./config/database');
// mongodb db connection
mongoose.Promise = global.Promise;
mongoose.connect(config.database);
let db = mongoose.connection;
db.once('open', function(){
  console.log('Connected to MongoDB');
});
db.on('error', function(err){
  console.log(err);
});
// Init App
const app = express();
// Bring in Models
let Article = require('./models/article');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
//set public folder
app.use(express.static(path.join(__dirname, 'public')))
// express session middleware
app.use(session({
  secret: 'keyboard bird',
  resave: true,
  saveUninitialized: true
}))
// express flash message middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});
// express Validator middleware
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Passport config
require('./config/passport')(passport);
// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req, res, next){
  res.locals.user =req.user || null;
  next();
});

// Articles without mongodb server data, Home Route
app.get('/', function(req, res){
  let articles = [
    {
      id: 1,
      title: 'Hu Ha Hau Mau',
      author: 'Jon Doh',
      body: 'Hu Ha Hau Mau'
    }
  ]
  res.render('index', {
      title: 'Wellcome to App Home Page',
      articles: articles
  });
});
// Route Files
let articles = require('./routes/article');
let users = require('./routes/users');
app.use('/articles', articles);
app.use('/users', users);

app.listen(3000, function(){
  console.log('My app is listening on port 3000...')
});
