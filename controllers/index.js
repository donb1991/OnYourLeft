'use strict';

var db = require('../models');
var request = require('request');

app.get('/', function(req, res) {
  res.render('buildPlaylist.ejs');
});

app.get('/search', function(req, res) {
  var url = encodeURI(`http://developer.echonest.com/api/v4/song/search?api_key=${process.env.ECHONESTAPIKEY}&format=json&results=100&artist=${req.query.q}&bucket=audio_summary&bucket=id:spotify&bucket=tracks`);
  var newSong = {};
  newSong.title = 'jsonSongs[i].title';
  newSong.artist = 'jsonSongs[i].artist_name';
  newSong.bpm = 100;
  newSong.spotifyTrackId = 'jsonSongs[i].tracks[0].foreign_id.split(\':\')[2]';


  request.get(url, function(err, response, body) {
    var songs = [];
    var newSong = {};
    var jsonSongs = JSON.parse(body).response.songs;
    for(var i = 0; i < jsonSongs.length; i++) {
      if(jsonSongs[i].tracks.length > 0) {
        newSong.title = jsonSongs[i].title;
        newSong.artist = jsonSongs[i].artist_name;
        newSong.bpm = jsonSongs[i].audio_summary.tempo;
        newSong.spotifyTrackId = jsonSongs[i].tracks[0].foreign_id.split(':')[2];
        songs.push(newSong);
        db.Track.findOneAndUpdate({title: newSong.spotifyTrackId}, newSong, {upsert: true}, function(err, data) {
          console.log(data, err);
        });
      }
      newSong = {};
    }
    res.send(songs);
  });
});
