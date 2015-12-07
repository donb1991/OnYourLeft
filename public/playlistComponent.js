var Playlist = React.createClass({
  render: function() {
    return <div>
      <div className="row">
        <div className="large-6 columns">
          <div className="row">
            <div className="large-10 columns">
              <input type="text" placeholder="Search" />
            </div>
            <div className="large-2 columns">
              <input type="text" name="name" placeholder="Pace" />
            </div>
          </div>
        </div>
        <div className="large-6 columns">
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
