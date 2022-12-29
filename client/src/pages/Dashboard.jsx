import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Track from '../components/Adding/Track'
import Separator from "../components/Adding/Separator";
import NextTrack from '../components/Adding/NextTrack'
import './styles/Dashboard.css'
import {QRCodeSVG} from 'qrcode.react';
import {getCurrentlyPlaying} from '../ApiServices'

const Dashboard = () => {

  const [copied, setCopied] = useState(false)
  const {id} = useParams()

  const [currentlyPlaying, setCurrentlyPlaying] = useState({});

  useEffect(()=>{
    async function currentHandler() {
      let response = await getCurrentlyPlaying(id)
      setCurrentlyPlaying(response)
    }
    currentHandler();
  }, [])

  const handleclick = () => {
    navigator.clipboard.writeText(`http://localhost:3000/adder/${id}`)
    setCopied(true)
  }

    return(
      <div id="dash-container">
        <h3 id="room-dash">Room #{id}#</h3>
        <div id="container-dash-top">
          <div id="container-dash-left">
            <QRCodeSVG size='200px' value={`http://localhost:3000/adder/${id}`} />
            <button className="button-dash" onClick={handleclick}>
              {copied ? 
              <span>Copied!</span>
              :
              <span>Copy Link</span>
              }
              </button>
          </div>
          <div id="container-dash-right">
          <NextTrack currentlyPlaying={currentlyPlaying}/>
          </div>
        </div>
          <div className="track-dash-container">
            <Track songName="I love being a little pokemon Man" />
            <Separator/>
            <Track />
            <Separator/>
            <Track />
            <Separator/>
            <Track />
            <Separator/>
            <Track />
            <Separator/>
            <Track />
            {/* {MAP TRACKS AND ADD SEPARATOR} */}
        </div>
      </div>
    )
}

export default Dashboard;