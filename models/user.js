var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  pace: {
    type: Number
  },
  playlists: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Playlist'
  }],
  spotifyUserId: {
    type: String
  },
  access_token: {
    type: String
  },
  refresh_token: {
    type: String
  },
  token_created: {
    type: Number
  }
});

var User = mongoose.model('User', userSchema);

module.exports = User;
