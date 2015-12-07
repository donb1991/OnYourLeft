var express = require('express');
app = express();
var ejs = require('ejs');
var mongoose = require('mongoose');
var db = require('./models');

app.set('view engine', 'ejs');
app.use(express.static('public'));
require('./controllers');

app.listen(process.env.PORT || 3000, function() {
  console.log("on port http://localhost:3000");
});
