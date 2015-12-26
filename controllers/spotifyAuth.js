var queryString = require('querystring');
var request = require('request');
var loginHelper = require('../middleware/loginHelper');
var stateKey = 'spotify_auth_state';
var db = require('../models');

app.get('/callback', function(req, res) {
  var code = req.query.code || null;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    form: {
      code: code,
      redirect_uri: process.env.CALLBACKURL || 'http://localhost:3000/callback',
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
      newUser.token_created = Date.now();

      request.get(options, function(error, response, body) {
        newUser.spotifyUserId = body.id;

        db.User.findOneAndUpdate({spotifyUserId: newUser.spotifyUserId}, newUser, {upsert: true}, function(err, data) {
          req.login(newUser.spotifyUserId);
          res.render('sendback');
        });
      });
    }
  });
});


function createRandomString(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for(var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
