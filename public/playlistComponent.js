var Playlist = React.createClass({
  getInitialState: function() {
    return {searchValue: '', pace: ''};
  },

  handleChange: function(event) {
    var nextState = {};
    nextState[event.target.name] = event.target.value;
    this.setState(nextState);
  },
  getTracks: function() {
    $.get("http://localhost:3000/search").done(function(data) {
      console.log(data);
    });
  },
  render: function() {
    return <div>
      <div className="row">
        <div className="large-8 columns">
          <div className="row">
            <div className="large-8 columns">
              <input type="text" name='searchValue' placeholder="Search" value={this.state.searchValue} onChange={this.handleChange}/>
            </div>
            <div className="large-2 columns">
              <input type="text" name="pace" placeholder="Pace" value={this.state.pace} onChange={this.handleChange}/>
            </div>
            <div className="large-2 columns">
              <button className="button" type='button' name='button' onClick={this.getTracks}>Search</button>
            </div>
          </div>
        </div>
        <div className="large-4 columns">
          <div className="large-4 columns large-offset-8">
            <button className="button" type="button" name="button">Export to Spotify</button>
          </div>
        </div>
      </div>
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
