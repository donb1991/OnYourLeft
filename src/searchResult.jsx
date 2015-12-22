var React = require('react');

var SearchResult = React.createClass({
  handleClick: function(event) {
    this.props.addToPlaylist(this.props.results[event.currentTarget.value]);
  },

  render: function() {
    var resultElms = this.props.results.map((result, index) => {
      return <tr className="track" key={index}>
        <td><button value={index} onClick={this.handleClick}><i className="fi-plus"/></button></td>
        <td>{result.title}</td>
        <td>{result.artist}</td>
        <td>{result.bpm}</td>
      </tr>
    });

    return <table className="large-7 columns results">
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

module.exports = SearchResult;
