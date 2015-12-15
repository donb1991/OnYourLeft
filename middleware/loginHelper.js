var loginHelper = function(req, res, next) {
  req.login = function(userId) {
    req.session.id = userId;
  };

  req.logout = function() {
    req.session.id = null;
  };

  if(!req.session.id) {
    res.locals.user = null;
  } else {
    res.locals.user = req.session.id;
  }

  next();
};

module.exports = loginHelper;
