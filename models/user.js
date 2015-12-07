var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  spotify_user_id: {
    type: 'string'
  },
  pace: {
    type: Number
  },
  playlists: {
    type: mongoose.Schema.Types.ObjectId,
    ref: playlist
  }
});

var User = mongoose.model('User', userSchema);

model.export = User;
