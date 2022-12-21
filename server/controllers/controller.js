const axios = require("axios");
const querystring = require("querystring");

function generateRandomString(length) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

exports.logSpotifyUser = (req, res) => {
  const client_id = "2b8732f64e5e4964bd06557c23889e56";
  const state = generateRandomString(16);
  const scope =
    "user-read-private " +
    "user-read-playback-state " +
    "user-modify-playback-state " +
    "user-read-currently-playing " +
    "streaming";

  const auth_query_parameters = new URLSearchParams({
    response_type: "code",
    client_id: client_id,
    scope: scope,
    redirect_uri: "http://localhost:3001/auth/code",
    state: state,
  });

  res.redirect(
    "https://accounts.spotify.com/authorize?" + auth_query_parameters.toString()
  );
};

// this function will be called as a callback from spotify when user accept or decline the auth
exports.grabAuthToken = async (req, res) => {
  const client_id = "2b8732f64e5e4964bd06557c23889e56";
  // REMOVE THIS WHEN PUSHING
  const client_secret = "ur_client_secret";
  console.log("spotify response code is " + req.query.code);
  const code = req.query.code || null;
  const state = req.query.state || null;
  if (state === null) {
    // error
    res.redirect("/");
  } else {
    const authToken_query_params = new URLSearchParams({
      grant_type: "authorization_code",
      code: req.query.code,
      redirect_uri: "http://localhost:3001/auth/code",
    });
    const spotifyResponse = await axios.post(
      "https://accounts.spotify.com/api/token",
      authToken_query_params.toString(),
      {
        headers: {
          Authorization:
            "Basic " +
            new Buffer.from(client_id + ":" + client_secret).toString("base64"),
        },
      }
    );
    console.log(spotifyResponse.data);
  }
};
