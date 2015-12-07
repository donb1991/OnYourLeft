var db = require('../models');

app.get('/', function(req, res) {
  res.render('buildPlaylist.ejs');
});
