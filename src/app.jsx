var React = require('react');
var ReactDOM = require('react-dom');
var PlaylistBuilder = require('./playlistBuilder.jsx');
var PlaylistsView = require('./playlistsView.jsx');
var PlaylistView = require('./playlistView.jsx');
var Nav = require('./nav.jsx');
import { Router, Route, IndexRoute} from 'react-router'

var App = React.createClass({
  componentWillMount: function() {
    $.get("https://onyourleft.herokuapp.com/api/users").then((data => {
      this.setState(data);
    }));
  },
  getInitialState: function() {
    return {
      user: null,
      userInputs: {
        searchValue: '',
        pace: '',
        searchBy: 'artist',
        title: ''
      }
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
        redirect_uri: "https://onyourleft.herokuapp.com/callback",
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
          $.get("https://onyourleft.herokuapp.com/api/users").then((data => {
            this.setState(data);
          }))
          resolve(true);
        } else {
          resolve(false);
        }
       }
     }, 1000);
    });
    return promise;
  },

  logout: function() {
    $.get("https://onyourleft.herokuapp.com/logout").done(() => {
      this.setState({user: null});
    });
  },

  render: function() {
    var children;
    if(this.props.children) {
      children = React.cloneElement(this.props.children, {
        logout: this.logout,
        login: this.login,
        user: this.state.user
      });
    } else {
      children = this.props.children;
    }
    return <div>
      <Nav
        logout={this.logout}
        login={this.login}
        user={this.state.user}
      />
      {children}
    </div>
  }
});

ReactDOM.render((
  <Router>
    <Route path='/' component={App} >
      <IndexRoute component={PlaylistBuilder} />
      <Route path='/playlists' component={PlaylistsView}/>
      <Route path='/playlists/:id' component={PlaylistView}/>
      <Route path='/users/:userId/playlists/' component={PlaylistsView}/>
    </Route>
    <Route path='*' />
  </Router>
  ), document.getElementById('reactContainer'));
