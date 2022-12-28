import { useParams } from "react-router-dom";
import './styles/Adding.css'
import Track from '../components/Adding/Track'
import NextTrack from '../components/Adding/NextTrack'
import AddButton from "../components/Adding/AddButton";
import Separator from "../components/Adding/Separator";
import { useContext, useState, useEffect } from "react";
import { BGContext } from "../App";
import {getCurrentlyPlaying} from '../ApiServices'

const Adding = () => {

  const {BGcolor} = useContext(BGContext);
  let {id} = useParams()

  const [currentlyPlaying, setCurrentlyPlaying] = useState({});

  useEffect(()=>{
    async function currentHandler() {
      let response = await getCurrentlyPlaying(id)
      setCurrentlyPlaying(response)
    }
    currentHandler();
  }, [])

  return(
    <div id="dash-back">
      <div className="adding-inner-container"  style={{backgroundColor : BGcolor}}>
        <div className="adding-container">
          <h3 id="adding-dash"># Room ID: {id} #</h3>
          <div className="next-track-container">
            <h1>Currently Playing: </h1>
            <NextTrack currentlyPlaying={currentlyPlaying}/>
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