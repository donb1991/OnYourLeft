var React = require('react');

var Search = React.createClass({
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
    return <div className="row" style={{"marginBottom": "30px"}}>
      <div className="large-8 columns large-offset-2 guideContainer" onSubmit={this.handleSubmit} style={{backgroundColor: "#212121", padding: "20px"}}>
        <div className="row columns">
          <h4>How fast are you?</h4>
        </div>

        <div className="row">
          <div className="large-4 columns">
            <input type="text" name="pace" placeholder="Minutes per Mile" value={this.props.userInputs.pace} onChange={this.handleChange}/>
          </div>
        </div>

        <div className="row columns">
          <h4>What music do you like?</h4>
        </div>
        <form className="row">
          <div className="large-2 columns">
            <select value={this.props.userInputs.searchBy} name="searchBy" onChange={this.handleChange}>
              <option value="artist">Artist</option>
              <option value="style">Genre</option>
              <option value="title">Title</option>
            </select>
          </div>
            <div className="large-8 columns">
              <input type="text" name='searchValue' placeholder="Search" value={this.props.userInputs.searchValue} onChange={this.handleChange}/>
            </div>
            <div className="large-2 columns">
              <button className="button" type='sumbit' name='button'>Search</button>
            </div>
        </form>

        <div className="row">
          <h4 className="columns">Name your playlist</h4>
        </div>
        <div className="row">
          <div className="large-9 columns">
            <input type="text" placeholder="Playlist Title" value={this.props.userInputs.title}  name="title" onChange={this.handleChange}/>
          </div>
          <div className="large-3 columns">
            <button className="button" onClick={this.handleExport}>Export to Spotify</button>
          </div>
        </div>
      </div>
    </div>
  }
});

module.exports = Search;
