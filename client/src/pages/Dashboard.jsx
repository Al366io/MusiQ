import { useParams } from "react-router-dom";
import Track from '../components/Track'
import NextTrack from '../components/NextTrack'
import './styles/Dashboard.css'

const Dashboard = () => {

  const {id} = useParams()

    return(
      <div id="dash-back">
        <div className="dashboard-container">
          <h1>Room {id}</h1>
          <div className="next-track-container">
            <NextTrack/>
          </div>
          <div className="track-list-container">
            <Track></Track>
          </div>
        </div>
      </div>
    )
}

export default Dashboard;