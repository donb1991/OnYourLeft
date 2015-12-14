window.Playlist = React.createClass({
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
