const { AuthTable, PartiesTable, IntervalTable } = require("../models/model");
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

      await AuthTable.update(
        {
        access_token: response
        },
        {
        where: {user_email: userInDb.user_email}
        }
      )
      
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
  // with 6 digits, assuming we have 10000 parties, probability of generating 2 equal strings is 0,46%
  const partyId = generateRandomString(6);
  const socketIoRoomId = generateRandomString(12);
  try {
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
    newParty.socket_room_id = socketIoRoomId;

    await PartiesTable.create(newParty);
    console.log(newParty);
    // here call the function that will set the interval to update this particular room
    this.triggerSocket(partyId, socketIoRoomId);

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
      .then(async (response) => {
        if (response?.is_playing !== false) {
          let genreString = await getArtistGenre(
            response.item.artists[0].id,
            token
          );
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

exports.checkIfUserHasParty = async (req, res) => {
  try {
    const userEmail = req.params.email;
    const user = await AuthTable.findOne({
      where: { user_email: userEmail },
    });
    if (user.party_id) {
      // console.log('found');
      res.send(user.party_id);
      res.status(200);
    } else {
      // user in db, but no partyId
      // console.log('not found');
      res.send("");
      res.status(204);
    }
  } catch (error) {
    //user not in db OR server error (1st one more likely)
    res.sendStatus(404);
  }
};

exports.checkIfRoomExists = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await AuthTable.findOne({
      where: { party_id: id },
    });
    if (user) {
      // console.log('found');
      res.status(200);
      res.send("true");
    } else {
      // console.log('not found');
      res.status(280); // made up code to say that it's all ok but party is not there
      res.send("false");
    }
  } catch (error) {
    // doesnt exist
    res.status(500);
    res.send(error);
  }
};

exports.getSocketIdRoom = async (req, res) => {
  try {
    console.log("entra nel try");
    const partyId = req.params.partyId;
    let party = await PartiesTable.findOne({
      where: { party_id: partyId },
    });
    console.log("fine try, socket: ", party.socket_room_id);
    res.status(200);
    res.send(party.socket_room_id);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

/** --------------- START OF SOCKET IO FUNCTIONS --------------- **/

exports.triggerSocket = async (socketRoom, partyId) => {
  setInterval(() => {
    this.socketIoGetQueue(socketRoom, partyId);
  }, 2000);
  return;
};

exports.socketIoGetQueue = async (socketRoomId, partyId) => {
  const token = await getPartyToken(partyId);
  try {
    let queueArray = await fetch("https://api.spotify.com/v1/me/player/queue", {
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
      .then((response) => {
        let q = [];
        let arrayTenElemQueue = response.queue.slice(0, 10);
        arrayTenElemQueue.forEach((song) => {
          let buff = {};
          buff.name = song.name;
          buff.artist = song.artists[0].name;
          buff.image = song.album.images[0].url;
          buff.id = song.id;
          q.push(buff);
        });
        let playing = {
          name: response.currently_playing.name,
          artist: response.currently_playing.artists[0].name,
          image: response.currently_playing.album.images[0].url,
          id: response.currently_playing.id,
        };
        q.unshift(playing);
        return q;
      });
    io.to(socketRoomId).emit("queue", queueArray);
  } catch (error) {
    console.log(error);
  }
};

exports.startSetIntervals = async () => {
  // go into partiesTable, take every party_id, with every socket_room_id
  // and call socketIoGetQueue on them.
  let parties = await PartiesTable.findAll();
  for (party of parties) {
    this.triggerSocket(
      party.dataValues.socket_room_id,
      party.dataValues.party_id
    );
  }
};

exports.searchSong = async (req, res) => {
  const partyId = req.params.partyId;
  const query = req.params.query;
  const token = await getPartyToken(partyId);
  searchQuery = query.replace(" ", "%20");
  try {
    let queryList = await fetch(
      `https://api.spotify.com/v1/search?q=${searchQuery}&type=track&limit=4`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    ).then((response) => {
      if (response.status === 200) {
        return response.json();
      } else return 0;
    });
    let arrayOfSongs = []
    queryList.tracks.items.forEach((song) => { 
      let buff = {}
      buff.name = song.name;
      buff.artist = song.artists[0].name;
      buff.image = song.album.images[0].url;
      buff.id = song.id;
      arrayOfSongs.push(buff)
    })
    res.status(200)
    res.send(arrayOfSongs)
  } catch (error) {
    console.log(error);
    res.sendStatus(500)
  }
};

// ******** //

exports.addSongToQueue = async () => {
  const partyId = req.params.partyId;
  const songId = req.params.songId;
  const token = await getPartyToken(partyId);
  try {
    await fetch(
      `https://api.spotify.com/v1/me/player/queue?uri=spotify%3Atrack%3A${songId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        method: "POST",
      }
    ).then((response) => {
      if (response.status === 200) {
        return response.json();
      } else return 0;
    });
  }
  catch(err){
    console.log(err);
  }
}