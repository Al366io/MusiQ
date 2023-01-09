// to call the db and ask if user has access token
// this will automatically return a valid token.
// if token in DB is expired it will refresh it and send it new
exports.getTokensFromDb = async (user_email) => {
  const response = await fetch(
    `http://localhost:3001/users/token/${user_email}`
  );
  if (response.status === 200) return response;
  return null;
};

exports.getSpotifyUserInfo = async (user_email) => {
  const response = fetch(`http://localhost:3001/users/info/${user_email}`).then(
    (response) => response.json()
  );
  return response;
};

exports.createParty = async (user_email, ownerOptions) => {
  const response = fetch(`http://localhost:3001/party/create/${user_email}`, {
    method: "POST",
    headers: {
      Accept: "application/json, text/plain",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(ownerOptions)
  }).then((response) => response.text());
  return response;
};

// call this passing partyId as parameter, gives u back the name of owner as a string
exports.getOwnerParty = (id) => {
  try {
    const response = fetch(`http://localhost:3001/party/owner/${id}`).then(
      (response) => response.text()
    );
    return response;
  } catch (error) {
    console.log(error);
    return '';
  }
}

exports.getUserRoom = async (email) => {
  try {
    const response = fetch(`http://localhost:3001/users/info/party/${email}`).then(
      (response) => response.text()
    );
    return response;
  } catch (error) {
    console.log(error);
    return '';
  }
}

exports.checkRoom = async (id) => {
  try {
    const response = fetch(`http://localhost:3001/party/${id}`).then(
      (response) => response.json()
    );
    return response;
  } catch (error) {
    console.log(error);
    return 'error';
  }
}

exports.getSocketRoomId = async (partyId) => {
  try {
    const response = fetch(`http://localhost:3001/party/socketRoom/${partyId}`).then(
      (response) => response.text()
    );
    return response;
  } catch (error) {
    console.log(error);
    return '';
  }
}

exports.getQueryResult = (partyId, query) => {
  try {
    const response = fetch(`http://localhost:3001/party/search/${partyId}/${query}`).then(
      (response) => response.json()
    );
    return response;
  } catch (error) {
    console.log(error);
    return [];
  }
}

exports.postAddedSong = (partyId, img, songName, songId, genres, duration) => {
  const data = {
    id : songId,
    image : img,
    name: songName,
    genres,
    duration
  }
  try {
    const response = fetch(`http://localhost:3001/party/queue/add/${partyId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then(response => response.text())
    return response.json()
  } catch (error) {
    console.log(error)
    return 'error'
  }
}