var db = require('../models');
var request = require('request');

app.get('/api/playlists/', function(req, res) {
  db.Playlist.find({}, function(err, playlists) {
    res.send(playlists);
  })
});

app.get('/api/playlists/:id', function(req, res) {
  db.Playlist.findOne({spotifyPlaylistId: req.params.id}).populate('tracks').exec(function(err, playlist) {
    res.send(playlist);
  });
});

app.post('/api/playlists', function(req, res) {
  var playlistInfo = {
    tracksIds: [],
    title: req.body.title,
    pace: req.body.pace,
    duration: req.body.duration,
    id: req.body.id
  }
  if(req.body.tracks === undefined) {
    res.send({error: "Playlist can't be empty"});
    return;
  }
  req.body.tracks.forEach((track) => {
    playlistInfo.tracksIds.push(track.spotifyTrackId);
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
          exportPlaylist(user, playlistInfo);
        }
      });
    } else {
      exportPlaylist(user, playlistInfo);
    }
  });
  res.send({status: 200});
});

function exportPlaylist(user, playlistInfo) {
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
      'name': playlistInfo.title,
      'public': false
    },
    json: true
  };

  request.post(options, function(error, response, body) {
    newPlaylist.spotifyPlaylistId = body.id;
    newPlaylist.dateCreate = Date.now();
    newPlaylist.name = playlistInfo.title;
    newPlaylist.pace = playlistInfo.pace;
    newPlaylist.duration = playlistInfo.duration;

    db.Playlist.findOneAndUpdate({id: playlistInfo.id}, newPlaylist, {upsert: true}, function(err, playlist) {
      var max = playlistInfo.tracksIds.length;
      var randomIndex = Math.floor(Math.random() * (max - 0));
      request.get("https://api.spotify.com/v1/tracks/" + playlistInfo.tracksIds[randomIndex].split(':')[2], function(error, response, body) {
        playlist.image = JSON.parse(body).album.images[0].url;
        playlist.save();
      });
      user.playlists.push(playlist);
      user.save();
      var url = encodeURI('https://api.spotify.com/v1/users/' + user.spotifyUserId + '/playlists/' + newPlaylist.spotifyPlaylistId + '/tracks?uris=' + playlistInfo.tracksIds.join(','));
      options = {
        url: url,
        method: "POST",
        headers: {
          "Accept": "application/json",
          'Authorization': 'Bearer ' + user.access_token
        }
      };
      request.post(options, function(error, response, body) {});
      var i = 0;
      function addTrack() {
        if(i === playlistInfo.tracksIds.length) {
          playlist.save();
          return;
        }
        db.Track.findOne({spotifyTrackId: playlistInfo.tracksIds[i]}, function(error, track) {
          playlist.tracks.push(track);
          i++;
          addTrack();
        });
      }
      addTrack();
    });
  });
}
