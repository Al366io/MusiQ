import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Track from "../components/Adding/Track";
import Separator from "../components/Adding/Separator";
import NextTrack from "../components/Adding/NextTrack";
import "./styles/Dashboard.css";
import { QRCodeSVG } from "qrcode.react";
import { io } from "socket.io-client";
import { triggerGetPlayingSong, triggerGetQueue } from "../ApiServices";


const Dashboard = () => {
  const [dataFromSocket, setDataFromSocket] = useState({});
  const [currentlyPlaying, setCurrentlyPlaying] = useState({});
  const [queue, setQueue] = useState([]);
  const [copied, setCopied] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    const socket = io("http://localhost:3001");
    socket.on("connect_error", () => {
      setTimeout(() => socket.connect(), 3001);
    });
    socket.on("currentlyPlaying", (data) => setDataFromSocket(data));
    socket.on("queue", (data) => setQueue(data));
    socket.on("disconnect", () => setCurrentlyPlaying({ error: "error" }));

    // triggers setInterval in backend
    // TODO : trigger this ONLY if the room actually exists. Imagine if you mess with the url and insert a random party id. Unexpected behaviour.
    triggerGetPlayingSong(id);
    triggerGetQueue(id);
  }, []);

  useEffect(() => {
    setCurrentlyPlaying(dataFromSocket);
  }, [dataFromSocket]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`http://localhost:3000/adder/${id}`);
    setCopied(true);
  };

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
        {/* ADD SEPARATOR INSIDE TRACK COMPONENT */}
        {/* <Track />
        <Separator />
        <Track />
        <Separator />
        <Track />
        <Separator />
        <Track />
        <Separator />
        <Track /> */}
        {/* {MAP TRACKS AND ADD SEPARATOR} */}
      </div>
    </div>
  );
};

export default Dashboard;
