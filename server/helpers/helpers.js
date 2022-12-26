const axios = require("axios");

exports.generateRandomString = function (length) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

exports.checkTokenValidity = (access_token) => {
  // make any call to an endpoint and check response status. If it is 401, token has expired.
};

exports.refreshExpiredToken = async (RT) => {
  const client_id = "2b8732f64e5e4964bd06557c23889e56";
  const client_secret = "8c2b6074a66d4ec3af20e50017a9ecda";

  const params = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: RT,
  });
  const spotifyResponse = await axios.post(
    "https://accounts.spotify.com/api/token",
    params.toString(),
    {
      headers: {
        Authorization:
          "Basic " +
          new Buffer.from(client_id + ":" + client_secret).toString("base64"),
      },
    }
  )
  console.log(spotifyResponse.data);
  const newToken = spotifyResponse.data.access_token;
  return newToken;
};