import '../styles/NextTrack.css'
import { FastAverageColor } from 'fast-average-color';
import { useEffect, useState } from 'react';
import { useContext } from "react";
import { BGContext } from "../../App";


function NextTrack({
  songName = 'Chocolate with Jesus',
  artistName = 'Purple Floyd',
  coverArt = 'https://upload.wikimedia.org/wikipedia/en/b/b7/Machine_Gun_Kelly_-_Mainstream_Sellout.png'},) 
  {
    
  const {setBGColor} = useContext(BGContext);
  const fac = new FastAverageColor();

  const [coverColor, setCoverColor] = useState()

  useEffect(()=> {
    fac.getColorAsync(coverArt)
      .then(color => {
        setCoverColor(color.hex)
        setBGColor(color.hex)
      })
  }, [])

  // TODO Implement dynamic song/genre/artist/minutes

  return (
    <div className="track-next">
      <div className="artist-cover-next">
        <img className='cover-next' src={coverArt} alt="Cover" />
      </div>
      <div className="central-info-list">
        <span className="song-list">{songName}</span>
        <span className="artist-list">{artistName}</span>
      </div>
    </div>
  );
};

export default NextTrack;