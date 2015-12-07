var mongoose = require('mongoose');

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/onYourLeft');

module.exports.User = require('./user');
module.exports.Playlist = require('./playlist');
module.exports.Track = require('./track');
module.exports.PlaylistTrack = require('./playlistTrack');
