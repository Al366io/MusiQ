
// TODO replace querystring(deprecated) with URLSearchParam
const querystring = require("querystring");
function generateRandomString(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

exports.logSpotifyUser = (req, res) => {
  var client_id = '2b8732f64e5e4964bd06557c23889e56';
  var state = generateRandomString(16);
  var scope = "user-read-private " +
  "user-read-playback-state " +
  "user-modify-playback-state " +
  "user-read-currently-playing " +
  "streaming";

  // res.redirect(
  //   "https://accounts.spotify.com/authorize?" +
  //     querystring.stringify({
  //       response_type: "code",
  //       client_id: client_id,
  //       scope: scope,
  //       redirect_uri: 'http://localhost:3000',
  //       state: state,
  //     })
  // );
  const auth_query_parameters = new URLSearchParams({
    response_type: "code",
    client_id: client_id,
    scope: scope,
    redirect_uri: 'http://localhost:3001/auth/code',
    state: state
  });
  
  res.redirect('https://accounts.spotify.com/authorize?' + 
  auth_query_parameters.toString());
  
}

exports.grabAuthToken = (req, res) => {
  console.log("spotify response code is " + req.query.code);
  res.redirect('http://localhost:3000')
}