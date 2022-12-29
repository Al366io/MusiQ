import { useParams } from "react-router-dom";
import { useState } from "react";
import Track from '../components/Adding/Track'
import Separator from "../components/Adding/Separator";
import './styles/Dashboard.css'
import {QRCodeSVG} from 'qrcode.react';

const Dashboard = () => {

  const [copied, setCopied] = useState(false)
  const {id} = useParams()

  const handleclick = () => {
    navigator.clipboard.writeText(`http://localhost:3000/adder/${id}`)
    setCopied(true)
  }

    return(
      <div id="dash-container">
        <h3 id="room-dash">Room {id}</h3>
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
            <button className="button-dash">Change Options</button>
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