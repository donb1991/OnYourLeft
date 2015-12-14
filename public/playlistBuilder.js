var Search = React.createClass({
  handleChange: function(event) {
    if(event.target.name === "pace") {
      this.props.updatePace(event.target.value);
    } else if(event.target.name === 'searchValue') {
      this.props.updateSearchValue(event.target.value);
    } else if(event.target.name === 'title'){
      this.props.updateTitle(event.target.value);
    } else {
      this.props.updateSearchBy(event.target.value);
    }
  },
  handleSubmit: function(event) {
    event.preventDefault();
    this.props.getTracks();
  },
  render: function() {
    return <div className="row">
      <form onSubmit={this.handleSubmit}>
        <div className="large-1 columns">
          <select value={this.props.searchBy} name="searchBy" onChange={this.handleChange}>
            <option value="artist">Artist</option>
            <option value="style">Genre</option>
            <option value="title">Title</option>
          </select>
        </div>
        <div className="large-3 columns">
          <input type="text" name='searchValue' placeholder="Search" value={this.props.searchValue} onChange={this.handleChange}/>
        </div>
        <div className="large-1 columns">
          <input type="text" name="pace" placeholder="Pace" value={this.props.pace} onChange={this.handleChange}/>
        </div>
        <div className="large-1 columns">
          <button className="button" type='sumbit' name='button'>Search</button>
        </div>
        <div className="large-3 columns large-offset-1">
          <input type="text" placeholder="Playlist Title" value={this.props.title}  name="title" onChange={this.handleChange}/>
        </div>
        <div className="large-2 columns">
          <button className="button" onClick={this.props.export}>Export to Spotify</button>
        </div>
      </form>
    </div>
  }
});

var SearchResult = React.createClass({
  handleClick: function(event) {
    this.props.addToPlaylist(this.props.results[event.currentTarget.value]);
  },
  render: function() {
    var resultElms = this.props.results.map((result, index) => {
      var src = `https://embed.spotify.com/?uri=${result.spotifyTrackId}`
      return <tr key={index}>
        <td><button value={index} onClick={this.handleClick}><i className="fi-plus"/></button></td>
        <td>{result.title}</td>
        <td>{result.artist}</td>
        <td>{result.bpm}</td>
      </tr>
    });

    return <table className="large-6 columns">
      <thead>
        <tr>
          <th />
          <th>
            Title
          </th>
          <th>
            Artist
          </th>
          <th>
            BPM
          </th>
        </tr>
      </thead>
      <tbody>
        {resultElms}
      </tbody>
    </table>
  }
});

var Playlist = React.createClass({
  handleClick: function(event) {
    this.props.removeFromPlaylist(event.currentTarget.value);
  },
  render: function() {
    var trackElms = this.props.tracks.map((track, index) => {
      return <tr key={index}>
        <td><button value={index} onClick={this.handleClick}><i className="fi-minus"/></button></td>
        <td>{track.title}</td>
        <td>{track.artist}</td>
        <td>{track.bpm}</td>
      </tr>
    })

    return <div className="large-6 columns">
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
  }
});

var PlaylistBuilder = React.createClass({
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
    this.setState({searchValue: value})
  },
  updateResults: function(value) {
    this.setState({results: value})
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
      <Search
        export={this.export}
        getTracks={this.getTracks}
        updatePace={this.updatePace}
        updateSearchBy={this.updateSearchBy}
        updateSearchValue={this.updateSearchValue}
        updateTitle={this.updateTitle}
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
  document.getElementById('buildPlaylist')
);
