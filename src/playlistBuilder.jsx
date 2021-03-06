var React = require('react');
var Search = require('./searchUI.jsx');
var SearchResult = require('./searchResult.jsx');
var Playlist = require('./playlist.jsx');
var URL = require('./url.js');

var PlaylistBuilder = React.createClass({
  componentDidMount: function() {
    var newState = {};
    if(localStorage.getItem('userInputs')) {
      newState.userInputs = JSON.parse(localStorage.getItem('userInputs')).userInputs;
      newState.userInputs.searchBy = 'artist';
      newState.userInputs.searchValue = '';
    }
    if(localStorage.getItem('results')) {
      newState.results = JSON.parse(localStorage.getItem('results')).results;
    }
    if(localStorage.getItem('playlist')) {
      newState.playlist = JSON.parse(localStorage.getItem('playlist')).playlist
    }
    this.setState(newState);
  },
  addToPlaylist: function(track) {
    var newState = {};
    newState.playlist = this.state.playlist;
    newState.duration = this.state.duration + track.duration;
    newState.playlist.push(track);
    localStorage.setItem('playlist', JSON.stringify({playlist: newState}));
    this.setState(newState);
  },

  getInitialState: function() {
    return {
      userInputs: {
        searchValue: '',
        pace: '',
        searchBy: 'artist',
        title: ''
      },
      bestBPM: 180,
      results: [],
      playlist: [],
      duration: 0,
      isLoading: false,
      hasError: false
    };
  },

  getTracks: function() {
    this.setState({isLoading: true, hasError: false});
    $.get(URL + "/api/search?q=" + this.state.userInputs.searchBy + '=' + this.state.userInputs.searchValue).done((data) => {
      var newPlaylist = this.sortTracks(data, this.state.bestBPM);
      this.setState({isLoading: false});
      if(newPlaylist.length === 0) {
        this.setState({hasError: true});
      } else {
        localStorage.setItem('results', JSON.stringify({results: newPlaylist}));
        this.updateResults(newPlaylist);
      }
    });
  },

  updateBPM: function(value) {
    var bpm = 0;
    var pace = value.split(':');
    var sorted;
    if(pace[0] >= 12) {
      bpm = 130;
    } else if(pace[0] <= 5) {
      bpm = 200;
    } else {
      bpm = ((12 - pace[0]) * 10) + 130;
      if(pace[1] >= 30) {
        bpm -= 5;
      }
    }
    sorted = this.sortTracks(this.state.results, bpm);
    this.setState({bestBPM: bpm, results: sorted});
  },

  updateIsLogin: function(value){
   this.setState({isLogin: value});
  },

  updatePlaylist: function(tracks) {
    localStorage.setItem('playlist', JSON.stringify({playlist: tracks}));
    this.setState({playlist: tracks});
  },

  updateResults: function(results) {
    this.setState({results: results});
  },

  updateUserInputs: function(name, value) {
    var newUserInputs = this.state.userInputs;
    newUserInputs[name] = value;
    this.setState({userInputs: newUserInputs});
    if(name === "pace") {
      this.updateBPM(value);
    }
  },

  sortTracks: function(tracks, bpm) {
    tracks.sort((a, b) => {
      if(Math.abs(bpm - a.bpm) <= Math.abs(bpm - b.bpm)) {
        return -1;
      } else {
        return 1;
      }
    });
    return tracks;
  },

  render: function() {
    return <div>
      <Search
        bestBPM={this.state.bestBPM}
        duration={this.state.duration}
        getTracks={this.getTracks}
        updateUserInputs={this.updateUserInputs}
        userInputs={this.state.userInputs}
        user={this.props.user}
        login={this.props.login}
        playlist={this.state.playlist}
      />
      <div className="row" hidden={!this.state.isLoading}>
        <div className="loading">
          <div className="spinner">
            <div className="mask">
              <div className="maskedCircle"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="row" hidden={!this.state.hasError}>
        <h4>No Tracks found</h4>
      </div>
      <div className="row" hidden={this.state.results.length === 0 && this.state.playlist.length === 0}>
        <SearchResult
          addToPlaylist={this.addToPlaylist}
          results={this.state.results}
        />
        <Playlist
          updateTracks={this.updatePlaylist}
          tracks={this.state.playlist}
        />
      </div>
    </div>
  }
});

module.exports = PlaylistBuilder;
