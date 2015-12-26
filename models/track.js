var mongoose = require('mongoose');

var trackSchema = mongoose.Schema({
  album: {
    type: Date
  },
  albumArt: {
    type: Number
  },
  artist: {
    type: String
  },
  bpm: {
    type: Number
  },
  duration: {
    type: Number
  },
  spotifyTrackId: {
    type: String
  },
  title: {
    type: String
  }
});

var Track = mongoose.model('Track', trackSchema);

module.exports = Track;
