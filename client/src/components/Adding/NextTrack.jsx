import "../styles/NextTrack.css";
import { FastAverageColor } from "fast-average-color";
import {extractColors} from 'extract-colors'

function NextTrack({ currentlyPlaying, BGsetter = ()=>{} }) {
  const fac = new FastAverageColor();

  const handleLoaded = async () => {
    const img = currentlyPlaying.image
    let colorObj = {}
    fac.getColorAsync(img).then((color) => {
      colorObj.avg = color.hex;
      extractColors(img, { crossOrigin: "anonymous" }).then(res => {
        colorObj.full = res.slice(0,4)
        BGsetter(colorObj)
      })
    })
  };

  const capitalize = (str) => {
    let arr = str.split(' - ')
    return arr.map(string => string.charAt(0).toUpperCase() + string.slice(1)).slice(0,2).join(' - ')
  }

  return (
    <div className="track-next">
        {currentlyPlaying.name ? (
          <>
            <img
              className="cover-next"
              src={currentlyPlaying.image}
              alt="Cover"
              onLoad={handleLoaded}
            />
            <div className="central-info-list next-central">
            {currentlyPlaying.name.split('').length < 35 ? (
              <span className="next-song-name song-list">
                {currentlyPlaying.name}
              </span>
              ) : (
              <span className="next-song-name song-list">
                {currentlyPlaying.name}
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
