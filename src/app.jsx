var React = require('react');
var ReactDOM = require('react-dom');
var BuildPage = require('./buildPage.jsx');

ReactDOM.render(
  <BuildPage
    isLogin={true}
  />,
  document.getElementById('reactContainer')
);
