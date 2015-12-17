app.get('/api/users', function(req, res) {
  res.send({user: req.session.id});
});

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});
