import "../styles/NextTrack.css";
import { FastAverageColor } from "fast-average-color";
import { useState } from "react";

function NextTrack({ currentlyPlaying, BGsetter }) {
  const fac = new FastAverageColor();

  const [setCoverColor] = useState();

  const handleLoaded = async () => {
    fac.getColorAsync(currentlyPlaying.cover).then((color) => {
      setCoverColor(color.hex);
      BGsetter(color.hex);
    });
  };

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
        {currentlyPlaying.playing ? (
          currentlyPlaying.title.split("").length < 60 ? (
            <span className="next-song-name song-list">
              {currentlyPlaying.title}
            </span>
          ) : (
            <span className="next-song-name song-list">
              {currentlyPlaying.title.slice(0, 60) + "[...]"}
            </span>
          )
        ) : (
          ""
        )}
        {currentlyPlaying.playing ? (
          <span className="artist-list">{currentlyPlaying.artist}</span>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default NextTrack;
