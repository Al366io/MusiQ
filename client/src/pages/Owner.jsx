import './styles/Owner.css'
import { useAuth0 } from "@auth0/auth0-react";
import { useState } from 'react';

const Owner = () => {

  const {user} = useAuth0();

  const [visible , setVisible] = useState()
  const [member , setMember] = useState()
  const [genre , setGenre] = useState()
  const [timeout , setTiemout] = useState()
  const [upvote , setUpvote] = useState()

  const handleSubmit = (e) =>{
    e.preventDefault()
  }

  return (
    <div id='owner-wrapper'>
      <h1 id='owner-heading'>{user.given_name}, Decide on your Party</h1>
      <form action="" id="owner-options" onSubmit={handleSubmit}>

        <label htmlFor='visibility'> Visibility </label>
        <select name="visibility" id="visibility">
          <option value="visible">Visible</option>
          <option value="invisible">Invisible</option>
        </select>

        <label htmlFor='members'> Members Only </label>
        <select name="members" id="members">
          <option value="members">Members-Only</option>
          <option value="anyone">Anyone</option>
        </select>

        <label htmlFor='genre-respect'> Genre Respect </label>
        <select name="genre-respect" id="genre-respect">
          <option value="classical">Classical</option>
          <option value="metal">Metal</option>
          <option value="pop">Pop</option>
          <option value="punk">Punk</option>
          <option value="rock">Rock</option>
          <option value="techno">Techno</option>
        </select>

        <label htmlFor='duplicate-timeout'> Duplicate Timeout </label>
        <input type='number' min='1' max='60' name="duplicate-timeout" id="duplicate-timeout" value='30'></input>


        <label htmlFor='upvote-toggle'> Upvote-Downvote </label>
        <select name="upvote-toggle" id="upvote-toggle">
          <option value="Allowed">Allowed</option>
          <option value="Disabled">Disabled</option>
        </select>

        <input type="submit" id='submit-party' value='CREATE' />

      </form>
    </div>
  );
};

export default Owner;