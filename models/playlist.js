var mongoose = require('mongoose');

var playlistSchema = mongoose.Schema({
  name: {
    type: String
  },
  dateCreate: {
    type: Date
  },
  pace: {
    type: String
  },
  duration: {
    type: Number
  },
  shared: {
    type: Number
  },
  spotifyPlaylistId: {
    type: String
  },
  image: {
    type: String
  },
  stars: {
    type: Number
  },
  tracks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Track'
  }]
});

var Playlist = mongoose.model('Playlist', playlistSchema);

module.exports = Playlist;
