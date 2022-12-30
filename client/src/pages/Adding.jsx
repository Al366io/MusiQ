import { useParams } from "react-router-dom";
import './styles/Adding.css'
import Track from '../components/Adding/Track'
import NextTrack from '../components/Adding/NextTrack'
import AddButton from "../components/Adding/AddButton";
import Separator from "../components/Adding/Separator";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import NoPage from "./NoPage";
import { getOwnerParty, triggerGetPlayingSong, checkRoom } from '../ApiServices'

const Adding = () => {

  const [BGcolor, setBGColor] = useState('#000')
  const [queue, setQueue] = useState([]);
  const [dataFromSocket, setDataFromSocket] = useState({});
  const [currentlyPlaying, setCurrentlyPlaying] = useState({});
  const [exists, setExist] = useState(false)
  let {id} = useParams()
  const [ownerName, setOwnerName] = useState('');

  useEffect(()=>{
    const socket = io("http://localhost:3001");
    socket.on("connect_error", () => {
      setTimeout(() => socket.connect(), 3001);
    });
    socket.on("currentlyPlaying", (data) => setDataFromSocket(data));
    socket.on("queue", (data) => {
      if(queue.length == 0) {
        setQueue(data)
      } else if (data[0].name != queue[0].name && data.length >= queue.length) {
        console.log(data.length)
        setQueue(data)}
      })
    socket.on("disconnect", () => setCurrentlyPlaying({error: 'error'}));

    // triggers setInterval in backend 
    triggerGetPlayingSong(id)
    getOwnerParty(id).then(res => setOwnerName(res))
    checkRoom(id).then(response => {setExist(response)})
  }, [])

  useEffect(()=>{
    setCurrentlyPlaying(dataFromSocket)
  }, [dataFromSocket])

  if (exists) {
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
            {!queue.length ? (
              <h1> 😞 No songs in Queue 😞 </h1>
            ) : (
              queue.map((song) => {
                return (
                  <Track
                    key={song.id}
                    song={song}
                    // songName="I love being a little pokemon Man"
                  />
                );
              })
            )}
            </div>
          </div>
          <AddButton/>
        </div>
      </div>
    );
  } else {
    return (
      <NoPage />
    )
  }
};

export default Adding;