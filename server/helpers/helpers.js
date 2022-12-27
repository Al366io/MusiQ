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

exports.checkTokenValidity = async (access_token) => {
  // make any call to an endpoint and check response status. If it is not 200, token has expired or some other error (if expired is 401)
  const response = await fetch("https://api.spotify.com/v1/me", {
    // simple call to ask for user info
    headers: {
      Authorization: `Bearer ${access_token}`,
      "Content-Type": "application/json",
    },
  });
  console.log(response.status);
  return response.status === 200 ? 1 : 0;
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
  );
  const newToken = spotifyResponse.data.access_token;
  return newToken;
};
