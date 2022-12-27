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
  const response = fetch(
    `http://localhost:3001/users/info/${user_email}`
  )
  .then((response) => response.json())
  return response;
};
