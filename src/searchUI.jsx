var React = require('react');
var URL = require('./url.js');

var Search = React.createClass({
  getInitialState: function() {
    if(localStorage.getItem('results') || localStorage.getItem('playlist')) {
      return {
        step2: false,
        step3: false
      }
    } else {
      return {
        step2: true,
        step3: true
      }
    }
  },

  export: function(event) {
    var title = '';
    if(!this.props.userInputs.title) {
      title = this.props.userInputs.pace + " Minute Miles Playlist";
    } else {
      title = this.props.userInputs.title;
    }
    $.ajax({
      method: "POST",
      url: URL + "/api/playlists",
      data: {
        title: title,
        tracks: this.props.playlist,
        pace: this.props.userInputs.pace,
        duration: this.props.duration,
        _id: false
      }
    });
    localStorage.clear();
  },

  handleChange: function(event) {
    var _this = this;
    var timeout;
    function updateState() {
      $(".step2").fadeIn("slow");
      _this.setState({step2: false});
      window.clearTimeout(timeout);
    }
    this.props.updateUserInputs(event.target.name, event.target.value);

    if(event.target.className === "step1") {
      timeout = window.setTimeout(updateState, 600);
    }

  },

  handleSubmit: function(event) {
    event.preventDefault();
    $(".step3").fadeIn("slow");
    this.setState({step3: false});
    this.props.getTracks();
  },

  handleExport: function(event) {
    event.preventDefault();
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
      <div className="large-8 columns large-offset-2 guideContainer"  style={{backgroundColor: "#212121", padding: "20px"}}>
        <div className="row columns">
          <h4>How fast are you?</h4>
        </div>

        <div className="row">
          <div className="large-4 columns">
            <input className="step1" type="text" name="pace" placeholder="Minutes per Mile" value={this.props.userInputs.pace} onChange={this.handleChange}/>
          </div>
          <div className="large-6 columns" hidden={(this.props.userInputs.pace && !this.state.step3) ? false : true}>
            <span>You should aim for songs with a {this.props.bestBPM} BPM</span>
          </div>
        </div>

        <div className="step2" hidden={this.state.step2}>
          <div className="row columns" >
            <h4>What music do you like?</h4>
          </div>
          <form className="row" onSubmit={this.handleSubmit}>
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
        </div>

        <form className="step3" hidden={this.state.step3} onSubmit={this.handleExport}>
          <div className="row">
            <h4 className="columns">Name your playlist</h4>
          </div>
          <div className="row">
            <div className="large-9 columns">
              <input type="text" placeholder="Playlist Title" value={this.props.userInputs.title}  name="title" onChange={this.handleChange}/>
            </div>
            <div className="large-3 columns">
              <button type="sumbit"><img src="create-playlist-green.png" /> </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  }
});

module.exports = Search;
