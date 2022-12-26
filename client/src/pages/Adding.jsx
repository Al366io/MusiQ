import { useParams } from "react-router-dom";
import './styles/Adding.css'
import Track from '../components/Adding/Track'
import NextTrack from '../components/Adding/NextTrack'
import AddButton from "../components/Adding/AddButton";

const Adding = () => {

  let {id} = useParams()

  return(
    <div id="dash-back">
      <div className="adding-inner-container">
        <div className="dashboard-container">
          <h1>Room {id}</h1>
          <div className="next-track-container">
            <NextTrack/>
          </div>
          <div className="track-list-container">
            <Track></Track>
          </div>
        </div>
        <AddButton/>
      </div>
    </div>
  );
};

export default Adding;