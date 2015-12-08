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

var Playlist = React.createClass({
  getInitialState: function() {
    return {searchValue: '', pace: ''};
  },
  updatePace: function(value) {
    this.setState({pace: value});
  },
  updateSearchValue: function(value) {
    this.setState({searchValue: value})
  },
  getTracks: function() {
    $.get("http://localhost:3000/search?q=" + this.state.searchValue).done(function(data) {
      console.log(data);
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
        <table className="large-6 columns">
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
        </table>
        <div className="large-6 columns">
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
          </table>
        </div>
      </div>
    </div>
  }
});

ReactDOM.render(
  <Playlist />,
  document.getElementById('buildPlaylist')
);
