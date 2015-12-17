var React = require('react');
import { Link } from 'react-router'

var Nav = React.createClass({
  handleLogin: function(){
    this.props.login().then((res, err) => {

    });
  },
  render: function() {
    var menu;
    if(this.props.user){
      menu = <ul className="menu">
        <li><Link to='/'>Build a Playlist</Link></li>
        <li><Link to='/playlists'>View all Playlist</Link></li>
        <li><Link to='/playlists/1'>Your Playlist</Link></li>
        <li><a onClick={this.props.logout}>Logout</a></li>
      </ul>
    } else {
      menu = <ul className="menu">
        <li><Link to='/'>Build a Playlist</Link></li>
        <li><Link to='/playlists'>View all Playlist</Link></li>
        <li><a id='login' onClick={this.handleLogin}>Login</a></li>
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

module.exports = Nav;
