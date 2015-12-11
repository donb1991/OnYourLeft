var Search = React.createClass({
  handleChange: function(event) {
    if(event.target.name === "pace") {
      this.props.updatePace(event.target.value);
    } else if(event.target.name === 'searchValue') {
      this.props.updateSearchValue(event.target.value);
    }
  },
  render: function() {
    return <div className="row">
      <div className="large-8 columns">
        <div className="row">
          <div className="large-8 columns">
            <input type="text" name='searchValue' placeholder="Search" value={this.props.searchValue} onChange={this.handleChange}/>
          </div>
          <div className="large-2 columns">
            <input type="text" name="pace" placeholder="Pace" value={this.props.pace} onChange={this.handleChange}/>
          </div>
          <div className="large-2 columns">
            <button className="button" type='button' name='button' onClick={this.props.getTracks}>Search</button>
          </div>
        </div>
      </div>
    </div>
  }
});

var SearchResult = React.createClass({
  handleClick: function(event) {
    this.props.addToPlaylist(this.props.results[event.target.value]);
  },
  render: function() {
    var resultElms = this.props.results.map((result, index) => {
      return <tr key={index}>
        <td>{result.title}</td>
        <td>{result.artist}</td>
        <td>A Album</td>
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
  handleSumbit: function(event) {

    $.ajax({
      method: "POST",
      url: "http://localhost:3000/playlist",
      data: {tracks: this.props.tracks}
    });
  },
  render: function() {
    var trackElms = this.props.tracks.map((track, index) => {
      return <tr key={index}>
        <td>{track.title}</td>
        <td>{track.artist}</td>
        <td>A Album</td>
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
        <div>
          <button className="button" onClick={this.handleSumbit}>Export to spotify</button>
        </div>
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
      playlist: []
    };
  },
  updatePace: function(value) {
    this.setState({pace: value});
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
    $.get("http://localhost:3000/search?q=" + this.state.searchValue).done((data) => {
      this.updateResults(data);
    });
  },
  render: function() {
    return <div>
      <Search
        getTracks={this.getTracks}
        updatePace={this.updatePace}
        updateSearchValue={this.updateSearchValue}
        pace={this.state.pace}
        searchValue={this.state.searchValue}
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
