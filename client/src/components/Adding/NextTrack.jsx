import "../styles/NextTrack.css";
import { FastAverageColor } from "fast-average-color";
import { useState } from "react";

function NextTrack({ currentlyPlaying, BGsetter = ()=>{} }) {
  const fac = new FastAverageColor();

  const [coverColor, setCoverColor] = useState();

  const handleLoaded = async () => {
    fac.getColorAsync(currentlyPlaying.cover).then((color) => {
      setCoverColor(color.hex);
      BGsetter(color.hex);
    });
  };

  const capitalize = (str) => {
    let arr = str.split(' - ')
    return arr.map(string => string.charAt(0).toUpperCase() + string.slice(1)).slice(0,2).join(' - ')
  }

  // TODO Implement dynamic song/genre/artist/minutes
  console.log(currentlyPlaying)
  return (
    <div className="track-next">
        {currentlyPlaying.playing ? (
          <>
            <img
              className="cover-next"
              src={currentlyPlaying.cover}
              alt="Cover"
              onLoad={handleLoaded}
            />
            <div className="central-info-list next-central">
            {currentlyPlaying.title.split("").length < 35 ? (
              <span className="next-song-name song-list">
                {currentlyPlaying.title}
              </span>
              ) : (
              <span className="next-song-name song-list">
                {currentlyPlaying.title}
              </span>
              )}
              { currentlyPlaying.genres ? <span className="genre-list"> {capitalize(currentlyPlaying.genres)} </span> : ''}
              <span className="artist-list">{currentlyPlaying.artist}</span>
            </div>
          </>
        ) : (
          <div> No Song Playing </div>
        )}
      </div>
  );
}

export default NextTrack;
