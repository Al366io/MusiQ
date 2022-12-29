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
    return arr.map(string => string.charAt(0).toUpperCase() + string.slice(1)).join(' - ')
  }

  // TODO Implement dynamic song/genre/artist/minutes

  return (
    <div className="track-next">
      <div className="artist-cover-next">
        {currentlyPlaying.playing ? (
          <img
            className="cover-next"
            src={currentlyPlaying.cover}
            alt="Cover"
            onLoad={handleLoaded}
          />
        ) : (
          <div> No Song Playing </div>
        )}
      </div>
      <div className="central-info-list next-central">
        {currentlyPlaying.playing ? ( <> {
          currentlyPlaying.title.split("").length < 60 ? (
            <>
              <span className="next-song-name song-list">
                {currentlyPlaying.title}
              </span>
              { currentlyPlaying.genres ? <span className="genre-list"> {capitalize(currentlyPlaying.genres)} </span> : ''}
              <span className="artist-list">{currentlyPlaying.artist}</span>
            </>
          ) : (
            <>
              <span className="next-song-name song-list">
                {currentlyPlaying.title.slice(0, 60) + "[...]"}
              </span>
              <span className="artist-list">{currentlyPlaying.artist}</span>
            </>
          )}
          </>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default NextTrack;
