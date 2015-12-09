'use strict';

var db = require('../models');
var request = require('request');

app.get('/', function(req, res) {
  res.render('buildPlaylist.ejs');
});

app.get('/search', function(req, res) {
  var url = encodeURI(`http://developer.echonest.com/api/v4/song/search?api_key=${process.env.ECHONESTAPIKEY}&format=json&results=100&artist=${req.query.q}&bucket=audio_summary`);
  request.get(url, function(err, response, body) {
    var songs = [];
    var newSong = {};
    var jsonSongs = JSON.parse(body).response.songs;
    for(var i = 0; i < jsonSongs.length; i++) {
      newSong.title = jsonSongs[i].title;
      newSong.artist = jsonSongs[i].artist_name;
      newSong.bpm = jsonSongs[i].audio_summary.tempo;
      songs.push(newSong);
      newSong = {};
    }
    res.send(songs);
  });
});
