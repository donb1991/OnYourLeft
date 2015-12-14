function obtainToken() {
  var scope = 'user-read-private user-read-email playlist-modify-public playlist-modify-private playlist-read-private';
  var url = 'https://accounts.spotify.com/authorize?' + queryString({
        response_type: 'code',
        client_id: '3985f789131b42f68a5dcebd5ae1b9cd',
        scope: scope,
        redirect_uri: 'http://localhost:3000/callback'
      });

  function queryString(obj) {
    var query = [];
    for (var i in obj) {
      query.push(encodeURIComponent(i) + '=' + encodeURIComponent(obj[i]));
    }
    return query.join('&');
  }

  var promise = new Promise(function(resolve, reject) {

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
  });

  return promise;
}

document.getElementById('login').addEventListener('click', function(event) {
  obtainToken().then(function(data, error) {});
});
