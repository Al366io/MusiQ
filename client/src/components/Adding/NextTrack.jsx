import '../styles/NextTrack.css'
import { FastAverageColor } from 'fast-average-color';
import { useEffect, useState } from 'react';
import { useContext } from "react";
import { BGContext } from "../../App";


function NextTrack({currentlyPlaying}) {
    
  const {setBGColor} = useContext(BGContext);
  const fac = new FastAverageColor();

  const [coverColor, setCoverColor] = useState()
  // const coverArt = props.currentlyPlaying.
  const coverArt = currentlyPlaying.cover;

  useEffect(()=> {
    fac.getColorAsync(currentlyPlaying.cover)
      .then(color => {
        setCoverColor(color.hex)
        setBGColor(color.hex)
      })
  }, [currentlyPlaying])

  // TODO Implement dynamic song/genre/artist/minutes

  return (
    <div className="track-next">
      <div className="artist-cover-next">
        <img className='cover-next' src={coverArt} alt="Cover" />
      </div>
      <div className="central-info-list">
        <span className="song-list">{currentlyPlaying.title}</span>
        <span className="artist-list">{currentlyPlaying.artist}</span>
      </div>
    </div>
  );
};

export default NextTrack;