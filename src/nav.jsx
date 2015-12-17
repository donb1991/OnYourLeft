var React = require('react');

var Nav = React.createClass({
  render: function() {
    var menu;
    if(this.props.isLogin){
      menu = <ul className="menu">
        <li><a href="#">Build a Playlist</a></li>
        <li><a href="#">View all Playlist</a></li>
        <li><a href="#">Your Playlist</a></li>
        <li><a href="#" onClick={this.props.logout}>Logout</a></li>
      </ul>
    } else {
      menu = <ul className="menu">
        <li><a href="#">Build a Playlist</a></li>
        <li><a href="#">View all Playlist</a></li>
        <li><a href="#" id='login' onClick={this.props.login}>Login</a></li>
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
