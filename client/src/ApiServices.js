// to call the db and ask if user has access token
// this will automatically return a valid token.
// if token in DB is expired it will refresh it and send it new
exports.getTokensFromDb = async (user_email) => {
  const res = await fetch(
    `http://localhost:3001/users/token/${user_email}`
  );
  if (res.status === 200) return res;
  return null;
};

exports.getSpotifyUserInfo = async (user_email) => {
  return fetch(`http://localhost:3001/users/info/${user_email}`).then(
    (res) => res.json()
  );
};

exports.createParty = async (user_email, ownerOptions) => {
  return fetch(`http://localhost:3001/party/create/${user_email}`, {
    method: "POST",
    headers: {
      Accept: "application/json, text/plain",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(ownerOptions)
  }).then((res) => res.text());
  ;
};

// call this passing partyId as parameter, gives u back the name of owner as a string
exports.getOwnerParty = (id) => {
  try {
    return fetch(`http://localhost:3001/party/owner/${id}`).then(
      (res) => res.text()
    );
    ;
  } catch (err) {
    console.log(err);
    return '';
  }
}

exports.getUserRoom = async (email) => {
  try {
    return fetch(`http://localhost:3001/users/info/party/${email}`).then(
      (res) => res.text()
    );
  } catch (err) {
    console.log(err);
    return '';
  }
}

exports.checkRoom = async (id) => {
  try {
    return fetch(`http://localhost:3001/party/${id}`).then(
      (res) => res.json()
    );
  } catch (err) {
    console.log(err);
    return 'err';
  }
}

exports.getSocketRoomId = async (partyId) => {
  try {
    return fetch(`http://localhost:3001/party/socketRoom/${partyId}`).then(
      (res) => res.text()
    );
    ;
  } catch (err) {
    console.log(err);
    return '';
  }
}

exports.getQueryResult = (partyId, query) => {
  try {
    return fetch(`http://localhost:3001/party/search/${partyId}/${query}`).then(
      (res) => res.json()
    );
    ;
  } catch (err) {
    console.log(err);
    return [];
  }
}

exports.postAddedSong = (songName, artist, image, songId, partyId, duration) => {
  const data = {
    id : songId,
    artist: artist,
    image : image,
    name: songName,
    // genres: genres,
    duration: duration,
  }
  try {
    return fetch(`http://localhost:3001/party/queue/add/${partyId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then(res => res.text())
    
  } catch (err) {
    console.log(err)
    return 'err'
  }
}

exports.playNext = (partyId) => {
  fetch(`http://localhost:3001/play/next/${partyId}/`)
}

exports.callUpvote = (partyId, songId) => {
  fetch(`http://localhost:3001/upvote/${partyId}/${songId}/`)
}
exports.callDownvote = (partyId, songId) => {
  fetch(`http://localhost:3001/downvote/${partyId}/${songId}/`)
}