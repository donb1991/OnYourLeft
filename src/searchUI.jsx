var React = require('react');
var loginMixin = require('./login.jsx');

var Search = React.createClass({
  mixins: [loginMixin],
  export: function(event) {
    $.ajax({
      method: "POST",
      url: "http://localhost:3000/api/playlists",
      data: {
        title: this.props.userInputs.title,
        tracks: this.props.playlist
      }
    });
    localStorage.clear();
  },

  handleChange: function(event) {
    this.props.updateUserInputs(event.target.name, event.target.value);
  },

  handleSubmit: function(event) {
    event.preventDefault();
    this.props.getTracks();
  },

  handleExport: function(event) {
    if(!this.props.user) {
      this.props.login().then(() => {
        this.export();
      });
    } else {
      this.export();
    }
  },

  render: function() {
    return <div className="row">
      <form onSubmit={this.handleSubmit}>
        <div className="large-1 columns">
          <select value={this.props.userInputs.searchBy} name="searchBy" onChange={this.handleChange}>
            <option value="artist">Artist</option>
            <option value="style">Genre</option>
            <option value="title">Title</option>
          </select>
        </div>
        <div className="large-3 columns">
          <input type="text" name='searchValue' placeholder="Search" value={this.props.userInputs.searchValue} onChange={this.handleChange}/>
        </div>
        <div className="large-1 columns">
          <input type="text" name="pace" placeholder="Pace" value={this.props.userInputs.pace} onChange={this.handleChange}/>
        </div>
        <div className="large-1 columns">
          <button className="button" type='sumbit' name='button'>Search</button>
        </div>
        <div className="large-3 columns large-offset-1">
          <input type="text" placeholder="Playlist Title" value={this.props.userInputs.title}  name="title" onChange={this.handleChange}/>
        </div>
        <div className="large-2 columns">
          <button className="button" onClick={this.handleExport}>Export to Spotify</button>
        </div>
      </form>
    </div>
  }
});

module.exports = Search;
