/**
 * DOC:
 * The Auth0 React SDK helps you retrieve the profile information associated with
 * logged-in users quickly in whatever component you need, such as their name or
 * profile picture, to personalize the user interface. The profile information is
 * available through the user property exposed by the useAuth0() hook
 */

import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

function UserProfile() {
  const { user, isAuthenticated, isLoading } = useAuth0();

  // async function connectSpotify() {
  //   // call the fetch method and await the response
  //   const response = await fetch("http://localhost:3001/connectspotify", {
  //     mode: 'cors', // no-cors, *cors, same-origin
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Access-Control-Allow-Origin': '*'
  //     },
  //   });
  //   const data = await response.json();
  //   console.log('response: ' + response);
  //   console.log('data: ' + data);
  //   // if response status from server is 200
  //   if (response.status === 200) {

  //   }
  // }

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return (
    isAuthenticated && (
      <div>
        <img src={user.picture} alt={user.name} />
        <h2>{user.name}</h2>
        <p>{user.email}</p>
        <a href="http://localhost:3001/connectspotify">CONNECT YOUR SPOTIFY</a>
      </div>
    )
  );
}

export default UserProfile;
