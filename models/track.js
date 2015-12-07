var mongoose = require('mongoose');

var trackSchema = mongoose.Schema({
  album: {
    type: Date
  },
  albumArt: {
    type: Number
  },
  bpm: {
    type: Number
  },
  runTime: {
    type: Number
  },
  spotifyTrackId: {
    type: String
  },
  playlists: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'playlistTrack'
  }],
  title: {
    type: String
  }
});

var Track = mongoose.model('track', trackSchema);

module.exports = Track;