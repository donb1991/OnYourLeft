var Nav = React.createClass({
  getInitialState: function() {
    return {
      login: false
    };
  },
  login: function() {
    var scope = 'user-read-private user-read-email playlist-modify-public playlist-modify-private playlist-read-private';
    var url = 'https://accounts.spotify.com/authorize?';
    var params = {
          response_type: 'code',
          client_id: '3985f789131b42f68a5dcebd5ae1b9cd',
          scope: scope,
          redirect_uri: 'http://localhost:3000/callback',
          show_dialog: true
        };
    var query = [];
    for (var i in params) {
      query.push(encodeURIComponent(i) + '=' + encodeURIComponent(params[i]));
    }
    url += query.join('&');

    var loginWindow = null;
    var width = 400;
    var height = 600;
    var left = (screen.width / 2) - (width / 2);
    var top = (screen.height / 2) - (height / 2);

    loginWindow = window.open(
      url,
      'Spotify',
      'menubar=no,location=no,resizable=no,scrollbars=no,status=no, width=' + width + ', height=' + height + ', top=' + top + ', left=' + left
    );
   var loginWindowClosed = setInterval(() => {
   if (loginWindow !== null) {
      if (loginWindow.login) {
        clearInterval(loginWindowClosed);
        this.setState({login: true});
       }
     }
   }, 1000);
  },
  logout: function() {
    this.setState({login: false})
  },
  render: function() {
    var menu;
    if(this.state.login){
      menu = <ul className="menu">
        <li><a href="#">Build a Playlist</a></li>
        <li><a href="#">View all Playlist</a></li>
        <li><a href="#">Your Playlist</a></li>
        <li><a href="#" onClick={this.logout}>Logout</a></li>
      </ul>
    } else {
      menu = <ul className="menu">
        <li><a href="#">Build a Playlist</a></li>
        <li><a href="#">View all Playlist</a></li>
        <li><a href="#" id='login' onClick={this.login}>Login</a></li>
      </ul>
    }
    return <nav className="top-bar" style={{"marginBottom": "30px"}}>
      <div className="top-bar-left">
        <ul className="menu">
          <li className="menu-text">On Your Left</li>
        </ul>
      </div>
      <div className="top-bar-right">
        {menu}
      </div>
    </nav>
  }
});

ReactDOM.render(<Nav />, document.getElementById('nav'));
