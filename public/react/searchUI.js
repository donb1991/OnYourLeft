window.Search = React.createClass({
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
  handleExport: function(event) {
    if(!this.props.isLogin) {
      this.props.login();
    } else {
      this.props.export();
    }
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
          <button className="button" onClick={this.handleExport}>Export to Spotify</button>
        </div>
      </form>
    </div>
  }
});
