var express      = require('express');
var app          = express();
var passport     = require('passport');
var mongoose     = require('mongoose');
var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var errorHandler = require('errorhandler');
var path         = require('path');
var favicon      = require('serve-favicon');

var publicDir = path.join(__dirname, '../client');
var port      = parseInt(process.env.PORT, 10) || 4567;
var hostname  = process.env.HOSTNAME || 'localhost';
var config    = require('./config/main');

var db = mongoose.connect(config.databaseUrl);

mongoose.connection.on('error', function connectionError (err) {
  console.error('Database Error: ', err);
});

// register the connection handler once only
mongoose.connection.once('open', function connectionOpen () {
  console.log('Database connection open');
  // Populate DB with sample data
//   if (config.seedDB) {
//     require('./seed');
//   }
});

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended : true
}));
app.use(express.static(publicDir));
app.use(errorHandler({
  dumpExceptions : true,
  showStack      : true
}));

app.use(passport.initialize());
require('./config/passport')(passport);

// todo: using favicon.icon instead of logo.png
app.use(favicon(path.join(publicDir, 'images/favicon.ico')));

app.get('/', function (req, res) {
  res.sendFile(path.join(publicDir, 'index.html'));
});

var accountRouter = require('./routes/accountRoutes')();
app.use('/api/account', accountRouter);

app.listen(port, hostname, function () {
  console.log('Running on port %s', port);
});

module.exports = app;
