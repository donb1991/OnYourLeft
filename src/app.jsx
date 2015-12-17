var React = require('react');
var ReactDOM = require('react-dom');
var PlaylistBuilder = require('./playlistBuilder.jsx');
var Nav = require('./nav.jsx');
import { Router, Route, Link } from 'react-router'

var App = React.createClass({
  render: function() {
    return <div>
      <Nav />
      {this.props.children}
    </div>
  }
});

ReactDOM.render((
  <Router>
    <Route path='/' component={App} >
      <Route path='/playlists/new' component={PlaylistBuilder} />
      <Route path='/playlists' />
      <Route path='/playlists/:id' />
      <Route path='/users/:userId/playlists/:id' />
    </Route>
    <Route path='*' />
  </Router>
  ), document.getElementById('reactContainer'));
