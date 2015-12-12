var Search = React.createClass({
  handleChange: function(event) {
    if(event.target.name === "pace") {
      this.props.updatePace(event.target.value);
    } else if(event.target.name === 'searchValue') {
      this.props.updateSearchValue(event.target.value);
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
        <div className="large-2 columns">
          <select value={this.props.searchBy} name="searchBy" onChange={this.handleChange}>
            <option value="artist">Artist</option>
            <option value="style">Genre</option>
            <option value="title">Title</option>
          </select>
        </div>
        <div className="large-5 columns">
          <input type="text" name='searchValue' placeholder="Search" value={this.props.searchValue} onChange={this.handleChange}/>
        </div>
        <div className="large-2 columns">
          <input type="text" name="pace" placeholder="Pace" value={this.props.pace} onChange={this.handleChange}/>
        </div>
        <div className="large-1 columns">
          <button className="button" type='sumbit' name='button'>Search</button>
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
    this.props.addToPlaylist(this.props.results[event.target.value]);
  },
  render: function() {
    var resultElms = this.props.results.map((result, index) => {
      var src = `https://embed.spotify.com/?uri=${result.spotifyTrackId}`
      return <tr key={index}>
        <td>{result.title}</td>
        <td>{result.artist}</td>
        <td> </td>
        <td>{result.bpm}</td>
        <td><button className="button" value={index} onClick={this.handleClick}>+</button></td>
      </tr>
    });

    return <table className="large-6 columns">
      <thead>
        <tr>
          <th>
            Title
          </th>
          <th>
            Artist
          </th>
          <th>
            Album
          </th>
          <th>
            BPM
          </th>
          <th>
            Add
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
    this.props.removeFromPlaylist(event.target.value);
  },
  render: function() {
    var trackElms = this.props.tracks.map((track, index) => {
      return <tr key={index}>
        <td>{track.title}</td>
        <td>{track.artist}</td>
        <td> </td>
        <td>{track.bpm}</td>
        <td><button className="button" onClick={this.handleClick}>-</button></td>
      </tr>
    })

    return <div className="large-6 columns">
        <table className="large-12 columns">
          <thead>
            <tr>
              <th>
                Title
              </th>
              <th>
                Artist
              </th>
              <th>
                Album
              </th>
              <th>
                BPM
              </th>
              <th>
                Add
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
      searchValue: '',
      pace: '',
      results: [],
      playlist: [],
      searchBy: 'artist'
    };
  },
  updatePace: function(value) {
    this.setState({pace: value});
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
  removeFromPlaylist: function(index) {
    var newState = this.state.playlist;
    newState.splice(index, 1);
    this.setState({playlist: newState});
  },
  getTracks: function() {
    $.get("http://localhost:3000/search?q=" + this.state.searchBy + '=' + this.state.searchValue).done((data) => {
      this.updateResults(data);
    });
  },
  export: function(event) {
    $.ajax({
      method: "POST",
      url: "http://localhost:3000/playlist",
      data: {tracks: this.state.playlist}
    });
  },
  render: function() {
    return <div>
      <Search
        export={this.export}
        getTracks={this.getTracks}
        updatePace={this.updatePace}
        updateSearchBy={this.updateSearchBy}
        updateSearchValue={this.updateSearchValue}
        pace={this.state.pace}
        searchValue={this.state.searchValue}
        searchBy={this.state.searchBy}
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
