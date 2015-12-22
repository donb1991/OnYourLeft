var React = require('react');
import { Link } from 'react-router'

var PlaylistsView = React.createClass({
  componentWillMount: function() {
    var url = "http://localhost:3000/api/playlists";
    if(this.props.params.userId) {
      url = "http://localhost:3000/api/users/" + this.props.params.userId + "/playlists/";
    }
    $.get(url, (data) => {
      this.setState({playlists: data, currectPage: window.location.hash.split('?')[0]});
    });
  },
  componentWillUpdate: function() {
    if(this.state.currectPage !== window.location.hash.split('?')[0]) {
      var url = "http://localhost:3000/api/playlists";
      if(this.props.params.userId) {
        url = "http://localhost:3000/api/users/" + this.props.params.userId + "/playlists/";
      }
      $.get(url, (data) => {
        this.setState({playlists: data, currectPage: window.location.hash.split('?')[0]});
      });
    }
  },
  getInitialState: function() {
    return {
      playlists: [],
      sortByPace: 1,
      currectPage: window.location.hash.split('?')[0]
    }
  },
  sortByDate: function() {
    var sorted = this.state.playlists.sort((a,b) => {
      return moment(a.dateCreate).isBefore(b.dateCreate) ? -1 : 1;
    });
    this.setState({playlists: sorted});
  },

  sortByPace: function(sortBy) {
    var sorted = this.state.playlists.sort((a,b) => {
      if(Number(a.pace.split(':')[0]) == Number(b.pace.split(':')[0])) {
        if(Number(a.pace.split(':')[1]) >= Number(b.pace.split(':')[1])) {
          return -1 * this.state.sortByPace;
        } else {
          return 1 * this.state.sortByPace;
        }
      } else if(Number(a.pace.split(':')[0]) >= Number(b.pace.split(':')[0])) {
        return 1 * this.state.sortByPace;
      } else {
        return -1 * this.state.sortByPace;
      }
    });
    this.setState({playlists: sorted, sortByPace: this.state.sortByPace * -1});
  },
  render: function() {
    var playlistsElms = this.state.playlists.map((playlist, index) => {
      var playlistURL = '/playlists/' + playlist.spotifyPlaylistId;
      return <div key={index} className="column playlistIcon" style={{paddingTop: "8px", "backgroundColor": "#212121"}}>
        <Link to={playlistURL}>
          <img style={{maxHeight: "260px"}} src={playlist.image} />
          <ul style={{listStyle: "none", paddingTop: "5px"}}>
            <li>Title: {playlist.name} </li>
            <li>Running Pace: {playlist.pace}</li>
            <li>Duration: {parseInt(playlist.playTime)} Minutes</li>
            <li>Created at: {moment(playlist.dateCreate).calendar()}</li>
          </ul>
        </Link>
      </div>

    });
    return <div>
      <div className="row">
        <div className="columns large-2">
          <h2>Playlists</h2>
        </div>
        <div className="columns large-4">
          <div style={{position: "relative"}}>
            <div>
              <input style={{transform: "translateY(20%)"}} type="button" className="button" onClick={this.sortByPace} value="Pace"/>
              <input style={{transform: "translateY(20%)"}} type="button" className="button" onClick={this.sortByDate} value="Date Created"/>
            </div>
          </div>
        </div>
      </div>
      <div className="row large-up-4" style={{padding: "15px"}}>
        {playlistsElms}
      </div>
    </div>
  }
});

module.exports = PlaylistsView;
