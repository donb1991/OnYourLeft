var db = require('../models');


app.get('/api/users', function(req, res) {
  res.send({user: req.session.id});
});

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

app.get('/api/users/:userId/playlists/', function(req,res) {
  console.log(req.params.userId);
  db.User.findOne({spotifyUserId: req.params.userId}).populate('playlists').exec(function(err, user) {
    console.log(user);
    res.send(user);
  });
});
