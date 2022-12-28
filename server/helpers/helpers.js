const axios = require("axios");
const { AuthTable, PartiesTable } = require("../models/model");
const { CLIENT_ID, CLIENT_SECRET } = require("../config");

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
  try {
    const response = await fetch("https://api.spotify.com/v1/me", {
      // simple call to ask for user info
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
    });
    return response.status === 200 ? 1 : 0;
  } catch (error) {
    return 0;
  }
};

exports.refreshExpiredToken = async (RT) => {
  // TODO implement with try catch
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
          new Buffer.from(CLIENT_ID + ":" + CLIENT_SECRET).toString("base64"),
      },
    }
  );
  const newToken = spotifyResponse.data.access_token;
  return newToken;
};

// TODO make a function that create an instance of herself whenever a token gets added in the db, then runs every 59 minutes
// to refresh them. Is this overkill ? IDK but it will assure us that every token is constantly OK

exports.getPartyToken = async (partyId) => {
  try {
    // in PartiesTable search for the room and get email
    const party = await PartiesTable.findOne({
      where: { party_id: partyId },
    });
    const email = party.owner_email;

    // in AuthTable search acess_token, try it, try it and if it's expired ask a new one.
    const user = await AuthTable.findOne({
      where: { user_email: email },
    });
    let token = user.access_token;

    const isValid = await this.checkTokenValidity(token);
    if (!isValid) {
      token = await this.refreshExpiredToken(token);
    }

    // send back a non-expired token
    return token.toString()

  } catch (error) {
    console.log(error);
  }
};
