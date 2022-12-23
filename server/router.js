const router = require('express').Router();

const { createParty, logSpotifyUser, grabAuthToken, passAuth0Info } = require('./controllers/controller');


/**
 * endpoints:
 * 1 - user to login
 * 2 - user to register (hopefully with google)
 * 3 - user to create a party (will be given a party ID)
 * 
 * 
 **/
//????????
router.get('/', passAuth0Info)

router.get('/connectspotify', logSpotifyUser)
router.get('/auth/code', grabAuthToken)

// router.post('/party', createParty);
// router.post('/messages', func2);

module.exports = router;