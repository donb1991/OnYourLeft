var React = require('react');
import {IndexLink, Link} from 'react-router'


var PlaylistView = React.createClass({
  componentWillMount: function() {
    var url = "http://localhost:3000/api/playlists/" + this.props.params.id;
    $.get(url, (data) => {
      this.setState({playlist: data});
    });
  },
  handleClick: function() {
    localStorage.setItem('playlist', JSON.stringify({playlist: this.state.playlist.tracks}));
    localStorage.setItem('userInputs', JSON.stringify({userInputs: {
      pace: this.state.playlist.pace,
      title: this.state.playlist.name
    }}))
  },
  getInitialState: function() {
    return {
      playlist: {
        name: '',
        pace: '',
        duration: '',
        tracks: [],
        _id: ''
      }
    }
  },

  handleExport: function(event) {
    if(!this.props.user) {
      this.props.login().then(() => {
        this.export();
      });
    } else {
      this.export();
    }
  },

  export: function(event) {
    $.ajax({
      method: "POST",
      url: "http://localhost:3000/api/playlists",
      data: {
        title: this.state.playlist.name,
        tracks: this.state.playlist.tracks,
        pace: this.state.playlist.pace,
        duration: this.state.duration
      }
    });
    localStorage.clear();
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
          <IndexLink to="/" state={{playlist: this.state.playlist.tracks}}>
            <input type="button" className="button" value="Edit" onClick={this.handleClick} style={{transform: "translateY(20%)"}}/>
          </IndexLink>
          <input type="button" className="button" value="Export to Spotify" onClick={this.handleExport} style={{transform: "translateY(20%)"}}/>
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
