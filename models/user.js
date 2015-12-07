var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  pace: {
    type: Number
  },
  playlists: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'playlist'
  }],
  spotifyUserId: {
    type: String
  }
});

var User = mongoose.model('User', userSchema);

module.exports = User;
