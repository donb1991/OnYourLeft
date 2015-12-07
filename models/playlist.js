var mongoose = require('mongoose');

var playlistSchema = mongoose.Schema({
  name: {
    type: String
  },
  dataCreate: {
    type: Date
  },
  pace: {
    type: Number
  },
  playTime: {
    type: Number
  },
  shared: {
    type: Number
  },
  spotifyPlaylistId: {
    type: String
  },
  stars: {
    type: Number
  },
  tracks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PlaylistTrack'
  }]
});

var Playlist = mongoose.model('Playlist', playlistSchema);

model.export = Playlist;
