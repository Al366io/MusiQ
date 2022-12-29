const { AuthTable, PartiesTable } = require("../models/model");
const url = require("url");
const axios = require("axios");
const {
  generateRandomString,
  refreshExpiredToken,
  getPartyToken,
  getArtistGenre,
} = require("../helpers/helpers");
const { CLIENT_ID, CLIENT_SECRET } = require("../config");

const tempUser = {};

exports.logSpotifyUser = (req, res) => {
  tempUser.user_email = req.params.email;
  const state = generateRandomString(16);
  const scope =
    "user-read-private " +
    "user-read-playback-state " +
    "user-modify-playback-state " +
    "user-read-currently-playing " +
    "streaming";

  const auth_query_parameters = new URLSearchParams({
    response_type: "code",
    client_id: CLIENT_ID,
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
  // console.log("spotify response code is " + req.query.code);
  const code = req.query.code || null;
  const state = req.query.state || null;
  const error = req.query.error || null;

  if (error) {
    // user probably denied access to spotify
    console.log("error");
    res.redirect("http://localhost:3000");
    return;
  }
  if (state === null) {
    // error
    res.redirect("http://localhost:3000");
    return;
  } else {
    const authToken_query_params = new URLSearchParams({
      grant_type: "authorization_code",
      code: code,
      redirect_uri: "http://localhost:3001/auth/code",
    });
    const spotifyResponse = await axios.post(
      "https://accounts.spotify.com/api/token",
      authToken_query_params.toString(),
      {
        headers: {
          Authorization:
            "Basic " +
            new Buffer.from(CLIENT_ID + ":" + CLIENT_SECRET).toString("base64"),
        },
      }
    );
    tempUser.access_token = spotifyResponse.data.access_token;
    tempUser.refresh_token = spotifyResponse.data.refresh_token;
    // console.log(tempUser);

    await updateOrCreate(tempUser);

    res.redirect(
      url.format({
        pathname: "http://localhost:3000",
        query: {
          accessToken: tempUser.access_token,
          refreshToken: tempUser.refresh_token,
        },
      })
    );
  }
};

async function updateOrCreate(user) {
  const alreadyInDb = await AuthTable.findOne({
    where: { user_email: user.user_email },
  });
  if (alreadyInDb) {
    AuthTable.update(
      {
        access_token: user.access_token,
        refresh_token: user.refresh_token,
      },
      {
        where: { id: alreadyInDb.id },
      }
    );
  } else {
    AuthTable.create(user);
  }
}
// res.status(200);
// res.send(data);

exports.checkIfHasToken = async (req, res) => {
  try {
    const userEmail = req.params.email;
    if (!userEmail) res.sendStatus(400);

    const userInDb = await AuthTable.findOne({
      where: { user_email: userEmail },
    });

    if (userInDb.access_token) {
      // user and token found. Check for token validity.
      // const isTokenValid = await checkTokenValidity(userInDb.access_token);
      // if (!isTokenValid) {
      // if token is not valid, ask for a new one
      const response = await refreshExpiredToken(userInDb.refresh_token);
      // here insert new access_token in DB
      userInDb.access_token = response;
      // TODO : dont use updateOrCreate one, just update it.
      await updateOrCreate(userInDb);
      // }
      res.status(200);
      res.send(userInDb.access_token);
    } else {
      // user not found in DB
      res.sendStatus(404);
    }
  } catch (error) {
    // here probably refreshExpiredToken faild so we jump here and send unauthorized
    // because: we had user in db. He had a token and a refresh token. Token was expired so
    // we tried to ask spotify for another one, but spotify said ERROR !
    // so 1) spotify's problem or 2) most likely user has remove the access to our app from Spotify.
    console.log(error);
    res.sendStatus(401);
  }
};

exports.getSpotifyUser = async (req, res) => {
  const userEmail = req.params.email;
  // take auth code from DB
  const userInDb = await AuthTable.findOne({
    where: { user_email: userEmail },
  });
  try {
    fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${userInDb.access_token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((response) => {
        res.send(response);
        res.status(200);
      });
  } catch (error) {
    res.sendStatus(500);
  }
};

exports.createParty = async (req, res) => {
  const userEmail = req.params.email;
  if (!userEmail) {
    // invalid request
    res.sendStatus(400);
    return;
  }
  const partyId = generateRandomString(5);
  // TODO : search in db if the party id just generated already exists - if yes, generate another string
  const alreadyInDb = await AuthTable.findOne({
    where: { user_email: userEmail },
  });
  try {
    console.log("party id: " + partyId);

    await AuthTable.update(
      {
        party_id: partyId,
      },
      {
        where: { user_email: userEmail },
      }
    );

    let buffParty = req.body;
    let newParty = {};
    newParty.visible = buffParty.visible === "visible" ? true : false;
    newParty.private = buffParty.private === "members" ? true : false;
    newParty.genre = buffParty.genre;
    newParty.duplicate_timeout = buffParty.timeout;
    newParty.upvote_allowed = buffParty.upvote === "Allowed" ? true : false;
    newParty.owner_email = userEmail;
    newParty.party_id = partyId;

    await PartiesTable.create(newParty);

    res.send(partyId);
    res.status(201);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

exports.getPlayingSong = async (req, res) => {
  const partyId = req.params.id;
  const token = await getPartyToken(partyId);
  try {
    fetch("https://api.spotify.com/v1/me/player", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else return 0;
      })
      .then( async (response) => {
        if (response?.is_playing !== false) {
          let genreString = await getArtistGenre(response.item.artists[0].id, token)
          const songPlaying = {
            title: response.item.name,
            artist: response.item.artists[0].name,
            cover: response.item.album.images[0].url,
            genres: genreString,
            playing: 1,
          };
          res.send(JSON.stringify(songPlaying));
          res.status(200);
        } else {
          res.send(JSON.stringify({ playing: 0 }));
          res.status(204);
        }
      });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

exports.getOwnerOfParty = async (req, res) => {
  const partyId = req.params.id;
  const token = await getPartyToken(partyId);
  try {
    fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((response) => {
        res.send(response.display_name);
        res.status(200);
      });
  } catch (error) {
    res.sendStatus(500);
  }
};

exports.triggerSocketGetPlayingSong = (req, res) => {
  const partyId = req.params.id;
  setInterval(()=>{
    this.socketIoGetPlayingSong(partyId)
  }, 2000)
  res.sendStatus(204);
}

exports.socketIoGetPlayingSong = async (partyId) => {
  const token = await getPartyToken(partyId);
  try {
    let a = await fetch("https://api.spotify.com/v1/me/player", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        } else return 0;
      })
      .then( async (response) => {
        if (response?.is_playing !== false) {
          let genreString = await getArtistGenre(response.item.artists[0].id, token)
          const songPlaying = {
            title: response.item.name,
            artist: response.item.artists[0].name,
            cover: response.item.album.images[0].url,
            genres: genreString,
            playing: 1,
          };
          return songPlaying;
        } else {
          return ({ playing: 0 });
        }
      });
      io.to('songs-room').emit('currentlyPlaying', a)
  } catch (error) {
    console.log(error);
  }
};