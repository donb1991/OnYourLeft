'use strict';

var db = require('../models');
var request = require('request');

app.get('/', function(req, res) {
  res.render('buildPlaylist.ejs');
});

app.get('/search', function(req, res) {
  var url = encodeURI(`http://developer.echonest.com/api/v4/song/search?api_key=${process.env.ECHONESTAPIKEY}&format=json&start=100&results=100&${req.query.q}&bucket=audio_summary&bucket=id:spotify&bucket=tracks`);
  var newSong = {};

  request.get(url, function(err, response, body) {
    var songs = [];
    var newSong = {};
    var jsonSongs = JSON.parse(body).response.songs;
    for(var i = 0; i < jsonSongs.length; i++) {
      if(jsonSongs[i].tracks.length > 0) {
        newSong.title = jsonSongs[i].title;
        newSong.artist = jsonSongs[i].artist_name;
        newSong.bpm = jsonSongs[i].audio_summary.tempo;
        newSong.spotifyTrackId = jsonSongs[i].tracks[0].foreign_id;
        songs.push(newSong);
        db.Track.findOneAndUpdate({spotifyTrackId: newSong.spotifyTrackId}, newSong, {upsert: true}, function(err, data) {
          // console.log(data, err);
          // songs.push(newSong);
        });
      }
      newSong = {};
    }
    res.send(songs);
  });
});


require('./spotify');

app.get('*', function(req, res) {
  res.send("ITS A 404. I think you are lost");
})
