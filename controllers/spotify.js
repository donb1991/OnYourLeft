var queryString = require('querystring');
var request = require('request');
var loginHelper = require('../middleware/loginHelper');
var stateKey = 'spotify_auth_state';
var db = require('../models');


app.get('/login', function(req, res) {
  var state = createRandomString(16);
  res.cookie(stateKey, state);
  var scope = 'user-read-private user-read-email playlist-modify-public playlist-modify-private playlist-read-private';
  res.redirect('https://accounts.spotify.com/authorize?' +
    queryString.stringify({
      response_type: 'code',
      client_id: process.env.SPOTIFYID,
      scope: scope,
      redirect_uri: 'http://localhost:3000/callback',
      state: state
    }));
});

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

app.get('/callback', function(req, res) {
  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;
  if(state === null || state != storedState) {
    res.redirect('/#' + queryString.stringify({error: 'state_mismatch'}));
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: 'http://localhost:3000/callback',
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(process.env.SPOTIFYID + ':' + process.env.SPOTIFYSECRET).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {
      if(!error && response.statusCode === 200) {
        var access_token = body.access_token;
        var refresh_token = body.refresh_token;
        var newUser = {};
        var options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };

        newUser.spotifyUserId = '';
        newUser.access_token = body.access_token;
        newUser.refresh_token = body.refresh_token;

        request.get(options, function(error, response, body) {
          newUser.spotifyUserId = body.id;
          db.User.findOneAndUpdate({spotifyUserId: newUser.spotifyUserId}, newUser, {upsert: true}, function(err, data) {
            req.login(newUser.spotifyUserId);
            res.redirect('/');
          });
        });
      } else {
        res.redirect('/#' +
          queryString.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }
});

app.get('/playlist', function(req, res) {
  // var options = {
  //   url: 'https://api.spotify.com/v1/users/donb91/playlists',
  //   method: "POST",  
  //   headers: {
  //     'Authorization': 'Bearer ' + access_token,
  //     'Content-Type': 'application/json',
  //     "Accept": "application/json"
  //   },
  //   body: {
  //     'name': "A NEW PLAYLIST ALL",
  //     "public":false
  //   },
  //   json: true
  // };
  console.log(res);
  res.send('res');
  // request.post(options, function(error, response, body) {
  //   console.log(error, body);
  // });
});

function createRandomString(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for(var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}