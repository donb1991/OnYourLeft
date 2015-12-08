var db = require('../models');
var request = require('request');

app.get('/', function(req, res) {
  res.render('buildPlaylist.ejs');
});

app.get('/search', function(req, res) {
  request.get('http://developer.echonest.com/api/v4/song/profile?api_key=' + process.env.ECHONESTAPIKEY + '&id=SOUJWUH13E89D89DED&bucket=audio_summary', function(err, response, body) {
    res.send(body);
  });
});
