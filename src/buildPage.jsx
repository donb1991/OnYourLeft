var React = require('react');
var ReactDOM = require('react-dom');
var Nav = require('./nav.jsx');
var PlaylistBuilder = require('./PlaylistBuilder.jsx');

var BuildPage = React.createClass({
  getInitialState: function() {
    return {
      isLogin: this.props.isLogin
    };
  },

  login: function() {
    var promise = new Promise((resolve, reject) => {;
      var scope = 'user-read-private user-read-email playlist-modify-public playlist-modify-private playlist-read-private';
      var url = 'https://accounts.spotify.com/authorize?';
      var params = {
        response_type: 'code',
        client_id: '3985f789131b42f68a5dcebd5ae1b9cd',
        scope: scope,
        redirect_uri: "http://localhost:3000/callback",
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
          this.setState({isLogin: true});
          resolve(true);
        } else {
          reject(false);
        }
       }
     }, 1000);
    });
    return promise;
  },

  logout: function() {
    this.setState({isLogin: false});
    $.get("http://localhost:3000/logout").done();
  },

  render: function() {
    return <div>
      <Nav
        isLogin={this.state.isLogin}
        login={this.login}
        logout={this.logout}
      />
      <PlaylistBuilder
        isLogin={this.state.isLogin}
        login={this.login}
      />
    </div>
  }
});

module.exports = BuildPage;
