var PlaylistBuilder = React.createClass({
  login: function() {
    var scope = 'user-read-private user-read-email playlist-modify-public playlist-modify-private playlist-read-private';
    var url = 'https://accounts.spotify.com/authorize?';
    var params = {
      response_type: 'code',
      client_id: '3985f789131b42f68a5dcebd5ae1b9cd',
      scope: scope,
      redirect_uri: 'http://localhost:3000/callback',
      show_dialog: true
    };
    var query = [];
    for (var i in params) {
      query.push(encodeURIComponent(i) + '=' + encodeURIComponent(params[i]));
    }
    url += query.join('&');

    var loginWindow = null;
    var width = 400;
    var height = 600;
    var left = (screen.width / 2) - (width / 2);
    var top = (screen.height / 2) - (height / 2);

    loginWindow = window.open(
      url,
      'Spotify',
      'menubar=no,location=no,resizable=no,scrollbars=no,status=no, width=' + width + ', height=' + height + ', top=' + top + ', left=' + left
    );
   var loginWindowClosed = setInterval(() => {
   if (loginWindow !== null) {
      if (loginWindow.login) {
        clearInterval(loginWindowClosed);
        this.updateIsLogin(true);
       }
     }
   }, 1000);
  },
  updateIsLogin: function(value){
   this.setState({isLogin: value});
  },
  logout: function() {
   this.setState({isLogin: false});
   $.get("http://localhost:3000/logout").done();
  },
  addToPlaylist: function(track) {
    var newState = this.state.playlist;
    newState.push(track);
    this.setState({playlist: newState});
  },
  getInitialState: function() {
    return {
      bestBPM: 180,
      searchValue: '',
      pace: '7:00',
      isLogin: false,
      results: [],
      playlist: [],
      searchBy: 'artist',
      title: ''
    };
  },
  updatePace: function(value) {
    var bpm = 0;
    var pace = value.split(':');
    var sorted;
    if(pace[0] >= 12) {
      bpm = 130;
    } else {
      bpm = ((12 - pace[0]) * 10) + 130;
      if(pace[1] >= 30) {
        bpm -= 5;
      }
    }
    sorted = this.sortTracks(this.state.results, bpm);
    this.setState({pace: value, bestBPM: bpm, results: sorted});
  },
  updateSearchBy: function(value) {
    this.setState({searchBy: value});
  },
  updateSearchValue: function(value) {
    this.setState({searchValue: value});
  },
  updateResults: function(value) {
    this.setState({results: value});
  },
  updateTitle: function(value) {
    this.setState({title: value});
  },
  removeFromPlaylist: function(index) {
    var newState = this.state.playlist;

    newState.splice(index, 1);
    this.setState({playlist: newState});
  },
  getTracks: function() {
    $.get("http://localhost:3000/search?q=" + this.state.searchBy + '=' + this.state.searchValue).done((data) => {
      var newPlaylist = this.sortTracks(data, this.state.bestBPM);
      this.updateResults(newPlaylist);
    });
  },
  export: function(event) {
    $.ajax({
      method: "POST",
      url: "http://localhost:3000/playlist",
      data: {
        title: this.state.title,
        tracks: this.state.playlist
      }
    });
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
      <Nav
        isLogin={this.state.isLogin}
        login={this.login}
        logout={this.logout}
      />
      <Search
        export={this.export}
        getTracks={this.getTracks}
        updatePace={this.updatePace}
        updateSearchBy={this.updateSearchBy}
        updateSearchValue={this.updateSearchValue}
        updateTitle={this.updateTitle}
        isLogin={this.state.isLogin}
        login={this.login}
        pace={this.state.pace}
        searchValue={this.state.searchValue}
        searchBy={this.state.searchBy}
        title={this.state.title}
      />
      <div className="row">
        <SearchResult
          addToPlaylist={this.addToPlaylist}
          results={this.state.results}
        />
        <Playlist
          updateTracks={this.updatePlaylist}
          removeFromPlaylist={this.removeFromPlaylist}
          tracks={this.state.playlist}
        />
      </div>
    </div>
  }
});

ReactDOM.render(
  <PlaylistBuilder />,
  document.getElementById('reactContainer')
);
