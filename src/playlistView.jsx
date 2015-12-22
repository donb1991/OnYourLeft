var React = require('react');

var PlaylistView = React.createClass({
  componentWillMount: function() {
    var url = "http://localhost:3000/api/playlists/" + this.props.params.id;
    $.get(url, (data) => {
      console.log(data);
      this.setState({playlist: data});
    });
  },

  getInitialState: function() {
    return {
      playlist: {
        name: '',
        pace: '',
        playTime: '',
        tracks: []
      }
    }
  },

  render: function() {
    var trackElms = this.state.playlist.tracks.map((track, index) => {
      return <tr className="track" key={index}>
        <td>{track.title}</td>
        <td>{track.artist}</td>
        <td>{track.runTime}</td>
        <td>{track.bpm}</td>
      </tr>
    });
    return <div>
      <div className="row">
        <h2 className="columns large-9">{this.state.playlist.name}</h2>
        <div className="columns large-3">
          <input type="button" className="button" value="Edit" style={{transform: "translateY(20%)"}}/>
          <input type="button" className="button" value="Export to Spotify" style={{transform: "translateY(20%)"}}/>
        </div>
      </div>
      <div className="row">
      <table className="columns large-12">
        <thead>
          <tr>
            <th>
              Title
            </th>
            <th>
              Artist
            </th>
            <th>
              Duration
            </th>
            <th>
              BPM
            </th>
          </tr>
        </thead>
        <tbody>
          {trackElms}
        </tbody>
      </table>
      </div>
    </div>

  }
});

module.exports = PlaylistView;
