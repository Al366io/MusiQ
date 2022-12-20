// import { useAuth0 } from "@auth0/auth0-react";
import { useParams } from "react-router-dom";
import Track from '../components/Track'
import NextTrack from '../components/NextTrack'
import './styles/Dashboard.css'

const Dashboard = () => {

  // const {user} = useAuth0()
  const {id} = useParams()

    return(
      <>
      <h1>Room {id}</h1>
      <div className="next-track-container">
        <NextTrack/>
      </div>
      <div className="track-list-container">
      <Track></Track>
      </div>
      </>
    )
}

export default Dashboard;