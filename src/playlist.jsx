var React = require('react');

var Playlist = React.createClass({
  handleClick: function(event) {
    var newTracks = this.props.tracks;
    newTracks.splice(event.currentTarget.value, 1);
    this.props.updateTracks(newTracks);
  },

  render: function() {
    var trackElms = this.props.tracks.map((track, index) => {
      return <tr className="track" key={index}>
        <td><button value={index} onClick={this.handleClick}><i className="fi-minus"/></button></td>
        <td>{track.title}</td>
        <td>{track.artist}</td>
      </tr>
    });

    return <div className="large-5 columns">
        <table className="large-12 columns">
          <thead>
            <tr>
              <th />
              <th>
                Title
              </th>
              <th>
                Artist
              </th>
            </tr>
          </thead>
          <tbody>
            {trackElms}
          </tbody>
        </table>
      </div>
  }
});

module.exports = Playlist;
