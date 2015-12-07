var express = require('express');
app = express();
var ejs = require('ejs');
var mongoose = require('mongoose');

app.set('view engine', 'ejs');
require('./controllers');

app.listen(process.env.PORT || 3000, function() {
  console.log("on port http://localhost:3000");
});
