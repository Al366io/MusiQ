import { useParams } from "react-router-dom";
import './styles/Adding.css'
import Track from '../components/Adding/Track'
import NextTrack from '../components/Adding/NextTrack'
import AddButton from "../components/Adding/AddButton";
import Separator from "../components/Adding/Separator";
import { useContext } from "react";
import { BGContext } from "../App";

const Adding = () => {

  const {BGcolor} = useContext(BGContext);

  let {id} = useParams()

  return(
    <div id="dash-back">
      <div className="adding-inner-container"  style={{backgroundColor : BGcolor}}>
        <div className="dashboard-container">
          <h3 id="adding-dash"># {id} #</h3>
          <div className="next-track-container">
            <NextTrack/>
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