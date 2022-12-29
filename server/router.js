const router = require("express").Router();
const {
  checkIfHasToken,
  logSpotifyUser,
  grabAuthToken,
  getSpotifyUser,
  createParty,
  getPlayingSong,
  getOwnerOfParty,
  triggerSocketGetPlayingSong
} = require("./controllers/controller");

// user to connects Spotify ( grab the email, grab the tokens, insert the user in DB )
// receive user mail, sends tokens back
router.get("/connectspotify/:email", logSpotifyUser);

// this is called directly by the spotify API as a callback, don't touch
router.get("/auth/code", grabAuthToken);

// check if user has token in db and if its expired refresh it and send it back (also update db)
// receive the user email, sends new auth token
router.get("/users/token/:email", checkIfHasToken);

// get info about the spotify user
// reveice the user email, sends user profile info
router.get("/users/info/:email", getSpotifyUser);

//user to create a party ( must provide the email of the user when calling this, and will be given a party ID )
router.post("/party/create/:email", createParty);

// to get currently playing song in a party
// receive the party id, returns the currently playing song
router.get("/party/playing/:id", getPlayingSong);

// to get owner of party
// receives party id, returns owner of party
router.get("/party/owner/:id", getOwnerOfParty);

// triggers set interval for the sent room
router.get("/party/update/:id", triggerSocketGetPlayingSong);

module.exports = router;
