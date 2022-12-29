import "../styles/NextTrack.css";
import { FastAverageColor } from "fast-average-color";
import { useEffect, useState } from "react";

function NextTrack({ currentlyPlaying, BGsetter }) {

  const fac = new FastAverageColor();

  const [coverColor, setCoverColor] = useState();

  const handleLoaded = async () => {
    fac.getColorAsync(currentlyPlaying.cover).then((color) => {
      setCoverColor(color.hex);
      BGsetter(color.hex);
  })
}

  // TODO Implement dynamic song/genre/artist/minutes

  return (
    <div className="track-next">
      <div className="artist-cover-next">
        <img className="cover-next" src={currentlyPlaying.cover} alt="Cover" onLoad={handleLoaded} />
      </div>
      <div className="central-info-list">
        {currentlyPlaying.playing ? (
          <span className="song-list">{currentlyPlaying.title}</span>
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
