import "../styles/Track.css";
import Separator from "./Separator";
import { callUpvote, callDownvote } from "../../ApiServices";

function Track({ partyId, song, last = false, search = false, setter = () => {} }) {
  const songName = song.name;
  const artistName = song.artist;
  const coverArt = song.image;
  // TODO Implement dynamic song/genre/artist Get info from api and pass in props
  // TODO Calculate minutes left with minutes left before previous song + length of song before
  const minutesLeft = 12;

  const handleClick = () => {
    if (search) {
      setter(song.id);
    }
  };

  function upvote() {
    callUpvote(partyId, song.id);
  }
  function downvote() {
    callDownvote(partyId, song.id);
  }

  return (
    <>
      <div
        className={`track-container${search ? " clickable" : ""}`}
        onClick={handleClick}
      >
        <div className="artist-cover-list">
          <img
            className="cover-track"
            src={coverArt}
            alt="Cover"
            width="75"
            height="75"
          />
        </div>
        <div className="central-info-list">
          {songName.split("").length < 60 ? (
            <span className="song-list">{songName}</span>
          ) : (
            <span className="song-list">{songName.slice(0, 60) + "[...]"}</span>
          )}
          {/* <span className="genres-list">{genreList.slice(0,2).join('-')}</span> */}
          <span className="artist-list">{artistName}</span>
        </div>
        <div className="leftThings">
          <div className="upvote-downvote">
            <button onClick={upvote}>+</button>
            <button onClick={downvote}>-</button>
          </div>
          <span> {song.vote} </span>
          <div className="minutes-left-list">
            <span className="minutes-left-num">{minutesLeft}</span>
            {minutesLeft > 1 ? (
              <span className="minutes-left-min">mins</span>
            ) : (
              <span className="minutes-left-min">min</span>
            )}
          </div>
        </div>
      </div>
      {!last ? <Separator /> : ""}
    </>
  );
}

export default Track;
