var queryString = require('querystring');
var request = require('request');
var stateKey = 'spotify_auth_state';


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
        'Authorization': 'Basic ' + (new Buffer(process.env.SPOTIFYID+ ':' + process.env.SPOTIFYSECRET).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {
      if(!error && response.statusCode === 200) {

        res.redirect('/');
      } else {
        res.redirect('/#' +
          queryString.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }
});

app.post('/playlist', function(req, post) {

});

function createRandomString(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for(var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
