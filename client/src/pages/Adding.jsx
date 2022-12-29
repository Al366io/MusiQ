import { useParams } from "react-router-dom";
import './styles/Adding.css'
import Track from '../components/Adding/Track'
import NextTrack from '../components/Adding/NextTrack'
import AddButton from "../components/Adding/AddButton";
import Separator from "../components/Adding/Separator";
import { useState, useEffect } from "react";
import {getCurrentlyPlaying} from '../ApiServices'
import { getOwnerParty } from "../ApiServices";

const Adding = () => {

  const [BGcolor, setBGColor] = useState('#000')
  let {id} = useParams()

  const [currentlyPlaying, setCurrentlyPlaying] = useState({});
  const [ownerName, setOwnerName] = useState('');

  useEffect(()=>{
    async function currentHandler() {
      let response = await getCurrentlyPlaying(id)
      setCurrentlyPlaying(response)
    }
    getOwnerParty(id).then(res => setOwnerName(res))
    currentHandler();
  }, [])

  return(
    <div id="dash-back">
      <div className="adding-inner-container"  style={{backgroundColor : BGcolor}}>
        <div className="adding-container">
          <h3 id="adding-dash">{ownerName + "'s Room"}</h3>
          <h6 id="sub-header-adding">#{id}#</h6>
          <div className="next-track-container">
            <NextTrack currentlyPlaying={currentlyPlaying} BGsetter = {setBGColor}/>
            {/* instead of NextTrack this should be the currently playing song in my opinion, and below the queue */}
          </div>
          <div className="track-list-container">
            <Track />
            <Separator />
            <Track />
            <Separator />
            <Track />
          </div>
        </div>
        <AddButton/>
      </div>
    </div>
  );
};

export default Adding;