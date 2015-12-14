var Nav = React.createClass({
  login: function() {
    var scope = 'user-read-private user-read-email playlist-modify-public playlist-modify-private playlist-read-private';
    var url = 'https://accounts.spotify.com/authorize?';
    var params = {
          response_type: 'code',
          client_id: '3985f789131b42f68a5dcebd5ae1b9cd',
          scope: scope,
          redirect_uri: 'http://localhost:3000/callback'
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
  },
  render: function() {
    return <nav className="top-bar" style={{"marginBottom": "30px"}}>
      <div className="top-bar-left">
        <ul className="menu">
          <li className="menu-text">On Your Left</li>
        </ul>
      </div>
      <div className="top-bar-right">
        <ul className="menu">
          <li><a href="#">Build a Playlist</a></li>
          <li><a href="#">View all Playlist</a></li>
          <li><a href="#">Your Playlist</a></li>
          <li><a href="#" id='login' onClick={this.login}>Login</a></li>
        </ul>
      </div>
    </nav>
  }
});

ReactDOM.render(<Nav />, document.getElementById('nav'));
