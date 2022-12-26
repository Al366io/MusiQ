
// to call the db and ask if user has access token
// this will automatically return a valid token.
// if token in DB is expired it will refresh it and send it new
exports.getTokensFromDb = async (user_email) => {
  const response = await fetch(`http://localhost:3001/users/token/${user_email}`);
  console.log(response);
  if(response.status === 200) return response;
  return null;
}

// to check spotify token validity 
exports.checkToken = () => {

}

// to ask for a new access token having the refresh_token
exports.refreshToken = () => {

}