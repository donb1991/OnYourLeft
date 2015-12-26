'use strict';

var db = require('../models');
var request = require('request');

app.get('/', function(req, res) {
  res.render('index.ejs');
});

app.get('/api/search', function(req, res) {
  var url = encodeURI(`http://developer.echonest.com/api/v4/song/search?api_key=${process.env.ECHONESTAPIKEY}&format=json&start=100&results=100&${req.query.q}&bucket=audio_summary&bucket=id:spotify&bucket=tracks`);
  var newSong = {};

  request.get(url, function(err, response, body) {
    var songs = [];
    var newSong = {};
    var jsonSongs = JSON.parse(body).response.songs;
    if(jsonSongs) {
      for(var i = 0; i < jsonSongs.length; i++) {
        if(jsonSongs[i].tracks.length > 0) {
          newSong.title = jsonSongs[i].title;
          newSong.artist = jsonSongs[i].artist_name;
          newSong.bpm = parseInt(jsonSongs[i].audio_summary.tempo);
          newSong.duration = parseInt(jsonSongs[i].audio_summary.duration);
          newSong.spotifyTrackId = jsonSongs[i].tracks[0].foreign_id;
          songs.push(newSong);
          db.Track.findOneAndUpdate({spotifyTrackId: newSong.spotifyTrackId}, newSong, {upsert: true}, function(err, data) {
            if(err) {
              throw(err);
            }
          });
        }
        newSong = {};
      }
    }
    res.send(songs);
  });
});


require('./spotifyAuth.js');
require('./users.js');
require('./playlists.js');

app.get('*', function(req, res) {
  res.send("ITS A 404. I think you are lost");
})
