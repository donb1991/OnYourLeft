var mongoose = require('mongoose');

var playlistTrackSchema = mongoose.Schema({
  playlist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Playlist'
  },
  track: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Track'
  }
});
