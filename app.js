var express = require('express');
app = express();
var ejs = require('ejs');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('cookie-session');
var loginHelper = require('./middleware/loginHelper');
var db = require('./models');

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(session({
  maxAge: 36000000,
  secret: 'adfx',
  name: 'onYourLeft'
}));
app.use(loginHelper);

require('./controllers');

app.listen(process.env.PORT || 3000, function() {
  console.log("on port http://localhost:3000");
});
