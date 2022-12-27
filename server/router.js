const router = require("express").Router();
const {
  checkIfHasToken,
  logSpotifyUser,
  grabAuthToken,
  getSpotifyUser,
} = require("./controllers/controller");

/**
 * endpoints:
 * 2 - user to connects Spotify ( grab the email, grab the tokens, insert the user in DB )
 * 3 - user to create a party ( must provide the email of the user when calling this, and will be given a party ID )
 *
 *
 **/
router.get("/connectspotify/:email", logSpotifyUser);

// this is called directly by the spotify API as a callback
router.get("/auth/code", grabAuthToken);

router.get("/users/token/:email", checkIfHasToken);

router.get("/users/info/:email", getSpotifyUser);

// router.post('/party', createParty);
// router.post('/messages', func2);

module.exports = router;
