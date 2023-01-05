import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Track from "../components/Adding/Track";
import NextTrack from "../components/Adding/NextTrack";
import NoPage from "./NoPage";
import "./styles/Dashboard.css";
import { QRCodeSVG } from "qrcode.react";
import { io } from "socket.io-client";
import { checkRoom, getSocketRoomId } from "../ApiServices";

const Dashboard = () => {

  const [currentlyPlaying, setCurrentlyPlaying] = useState({});
  const [exists, setExist] = useState(true)
  const [queue, setQueue] = useState([]);
  const [copied, setCopied] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    const socket = io("http://localhost:3001");
    socket.on("connect_error", () => {
      setTimeout(() => socket.connect(), 3001);
    });

    async function fetchSocketRoomId() {
      const socketRoomId = await getSocketRoomId(id);
      socket.emit('join-room', socketRoomId)
    }
    fetchSocketRoomId();
    
    socket.on("queue", (data) => {
      setCurrentlyPlaying(data[0]);
      if(queue.length === 0) {
        setQueue(data)
      } else if (data[1].name !== queue[0].name && data.length >= queue.length-1) {
        setQueue(data)
      }
    });
    
    socket.on("disconnect", () => setCurrentlyPlaying({ error: "error" }));
    checkRoom(id).then((response) => setExist(response));
  }, []);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`http://localhost:3000/adder/${id}`);
    setCopied(true);
  };

  if (exists) {
      return (
        // TODO : RETURN ALL OF THIS ONLY IF ROOM EXISTS
        <div id="dash-container">
          <h3 id="room-dash">Room {id}</h3>
          <div id="container-dash-top">
            <div id="container-dash-left">
              <QRCodeSVG size="200px" value={`http://localhost:3000/adder/${id}`} />
              <button className="button-dash" onClick={handleCopyLink}>
                {copied ? <span>Copied!</span> : <span>Copy Link</span>}
              </button>
            </div>
            <div id="container-dash-right">
              <NextTrack currentlyPlaying={currentlyPlaying} />
            </div>
          </div>
          <div className="track-dash-container">
            <div id="extend-container">
              <span id="queue-text">Queue</span>
            </div>
            {!queue.length ? (
              <h1> No songs in Queue </h1>
            ) : (
              queue.map((song) => {
                return (
                  <Track
                    key={song.id}
                    song={song}
                  />
                );
              })
            )}
          </div>
        </div>
      );
  } else {
    return <NoPage/>
  }

  
};

export default Dashboard;
