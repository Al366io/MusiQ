import "./styles/Owner.css";
import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AnimatedBackground from "../components/AnimatedBackground";
import { createParty } from "../ApiServices";
import { useEffect } from "react";

const Owner = () => {
  const { user } = useAuth0();
  const navigate = useNavigate();

  const [visible, setVisible] = useState("visible");
  const [member, setMember] = useState("members");
  const [genre, setGenre] = useState("classical");
  const [timeout, setTimeout] = useState("30");
  const [upvote, setUpvote] = useState("Allowed");
  const [ownerOptions, setOwnerOptions] = useState({});

  useEffect(()=>{
    setOwnerOptions({
      visible,
      member,
      genre,
      timeout,
      upvote,
    })
  },[visible, member, genre, timeout, upvote])

  const handleSubmit = async (e) => {
    e.preventDefault();
    const id = await createParty(user.email, ownerOptions);
    navigate(`/dashboard/${id}`);
  };
  
  // TODO : Grab Genres list from spotify.
  return (
    <div id="owner-background">
      <AnimatedBackground />
      <div id="owner-wrapper">
        <h1 id="owner-heading">You're the boss here</h1>
        <form action="" id="owner-options" onSubmit={handleSubmit}>
          <label htmlFor="visibility"> Visibility </label>
          <select
            name="visibility"
            id="visibility"
            onChange={(e) => {
              setVisible(e.target.value);
            }}
          >
            <option value="visible">Visible</option>
            <option value="invisible">Invisible</option>
          </select>

          <label htmlFor="members"> Members Only </label>
          <select
            name="members"
            id="members"
            onChange={(e) => {
              setMember(() => e.target.value);
            }}
          >
            <option value="members">Members-Only</option>
            <option value="anyone">Anyone</option>
          </select>

          <label htmlFor="genre-respect"> Genre Respect </label>
          <select
            name="genre-respect"
            id="genre-respect"
            onChange={(e) => {
              setGenre(e.target.value);
            }}
          >
            <option value="classical">Classical</option>
            <option value="metal">Metal</option>
            <option value="pop">Pop</option>
            <option value="punk">Punk</option>
            <option value="rock">Rock</option>
            <option value="techno">Techno</option>
          </select>

          <label htmlFor="duplicate-timeout"> Duplicate Timeout </label>
          <input
            type="number"
            min="1"
            max="60"
            name="duplicate-timeout"
            id="duplicate-timeout"
            value="30"
            onChange={(e) => {
              setTimeout(e.target.value);
            }}
          ></input>

          <label htmlFor="upvote-toggle"> Upvote-Downvote </label>
          <select
            name="upvote-toggle"
            id="upvote-toggle"
            onChange={(e) => {
              setUpvote(e.target.value);
            }}
          >
            <option value="Allowed">Allowed</option>
            <option value="Disabled">Disabled</option>
          </select>

          <input type="submit" id="submit-party" value="CREATE" />
        </form>
      </div>
    </div>
  );
};

export default Owner;
