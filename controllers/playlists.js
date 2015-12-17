var db = require('../models');
var request = require('request');

app.get('/api/playlists/', function(req, res) {
  db.Playlist.find({}, function(err, playlists) {
    res.send(playlist);
  })
});

app.get('/api/playlists/:id', function(req, res) {
  db.Playlist.findOne({spotifyPlaylistId: req.params.id}).populate('tracks').exec(function(err, playlist) {
    res.send(playlist);
  });
});

app.post('/api/playlists', function(req, res) {
  var tracksIds = [];
  var title = req.body.title;
  req.body.tracks.forEach((track) => {
    tracksIds.push(track.spotifyTrackId);
  });
  db.User.findOne({spotifyUserId: req.session.id}, function(err, user) {
    if(Date.now() > user.token_created + (3555 * 1000)) {
      var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: { 'Authorization': 'Basic ' + (new Buffer(process.env.SPOTIFYID + ':' + process.env.SPOTIFYSECRET).toString('base64')) },
        form: {
          grant_type: 'refresh_token',
          refresh_token: user.refresh_token
        },
        json: true
      };
      request.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {
          user.access_token = body.access_token;
          user.refresh_token = body.refresh_token;
          user.token_created = Date.now();
          user.save();
          exportPlaylist(user, tracksIds, title);
        }
      });
    } else {
      exportPlaylist(user, tracksIds, title);
    }
  });
  res.redirect('/');
});

function exportPlaylist(user, tracksIds, title) {
  var newPlaylist = {};
  var options = {
    url: 'https://api.spotify.com/v1/users/' + user.spotifyUserId + '/playlists',
    method: "POST",
    headers: {
      'Authorization': 'Bearer ' + user.access_token,
      'Content-Type': 'application/json',
      "Accept": "application/json"
    },
    body: {
      'name': title,
      "public":false
    },
    json: true
  };

  request.post(options, function(error, response, body) {
    if(error) {
      console.log(error);
    } else {
      newPlaylist.spotifyPlaylistId = body.id;
      newPlaylist.dateCreate = Date.now();
      newPlaylist.name = "A NEW PLAYLIST ALL";
      db.Playlist.create(newPlaylist, function(err, playlist) {
        user.playlists.push(playlist);
        user.save();
        var url = encodeURI('https://api.spotify.com/v1/users/' + user.spotifyUserId + '/playlists/' + playlist.spotifyPlaylistId + '/tracks?uris=' + tracksIds.join(','));
        options = {
          url: url,
          method: "POST",
          headers: {
            "Accept": "application/json",
            'Authorization': 'Bearer ' + user.access_token
          }
        };
        request.post(options, function(error, response, body) {

        });
        for(var i = 0; i < tracksIds.length; i++) {
          db.Track.findOne({spotifyTrackId: tracksIds[i]}, function(error, track) {
            playlist.tracks.push(track);
            playlist.save();
          });
        }
      });
    }
  });
}
