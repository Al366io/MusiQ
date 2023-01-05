import { useParams } from "react-router-dom";
import "./styles/Adding.css";
import Track from "../components/Adding/Track";
import NextTrack from "../components/Adding/NextTrack";
import AddButton from "../components/Adding/AddButton";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import NoPage from "./NoPage";
import {
  getOwnerParty,
  checkRoom,
  getSocketRoomId,
  addSongToQueue,
} from "../ApiServices";

const Adding = () => {
  const [BGcolor, setBGColor] = useState("#000");
  const [queue, setQueue] = useState([]);
  const [currentlyPlaying, setCurrentlyPlaying] = useState({'':''});
  const [exists, setExist] = useState(true);
  const [ownerName, setOwnerName] = useState("");
  const [addSong, setAddSong] = useState({})

  let { id } = useParams();

  useEffect(() => {
    const socket = io("http://localhost:3001");
    socket.on("connect_error", () => {
      setTimeout(() => socket.connect(), 3001);
    });

    async function fetchSocketRoomId() {
      const socketRoomId = await getSocketRoomId(id);
      socket.emit("join-room", socketRoomId);
    }
    fetchSocketRoomId();

    socket.on("queue", (data) => {
      setCurrentlyPlaying(data[0]);
      if(queue.length === 0) {
        setQueue(data.slice(1))
      }
      // } else if (data[1].name !== queue[0].name && data.length >= queue.length-1) {
      //   setQueue(data.slice(1))
      // }
    });

    socket.on("disconnect", () => setCurrentlyPlaying({ error: "error" }));
    checkRoom(id).then((response) => setExist(response));

    // FOR SOME REASON, THIS CREATES TOO MANY REQUESTS
    // getOwnerParty(id).then(response => setOwnerName(response))

  }, []);

  useEffect(() => {
    // addSongToQueue(id, addSong.id);
  }, [addSong])

  if (exists) {
    return (
      <div id="dash-back">
        <div
        key={currentlyPlaying[0]}
          className="adding-inner-container"
          style={BGcolor.full?{ 
            
            'backgroundColor':`${BGcolor.avg}`,
            'backgroundImage':
            `radial-gradient(at 40% 20%, ${BGcolor.full[0].hex} 0px, transparent 50%), radial-gradient(at 80% 0%, ${BGcolor.full[1].hex} 0px, transparent 50%),radial-gradient(at 0% 50%, ${BGcolor.full[2].hex} 0px, transparent 50%), radial-gradient(at 80% 50%, ${BGcolor.full[3].hex} 0px, transparent 50%)`,
            'transition': 'background-image 1s ease-in-out'
          }:
          {
            'backgroundColor':`${BGcolor.avg}`,
            'transition': 'background-image 1s ease-in-out'

          }
        }
        >
          <div className="adding-container">
            <div className="next-track-container">
              <h3 id="adding-dash">{ownerName + "'s Room"}</h3>
              <h6 id="sub-header-adding">#{id}#</h6>
              <NextTrack
                currentlyPlaying={currentlyPlaying}
                BGsetter={setBGColor}
              />
            </div>
            <div className="track-list-container">
              {!queue.length ? (
                <h1> No songs in queue </h1>
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
          <AddButton id = {id} setter = {setAddSong} />
        </div>
      </div>
    );
  } else {
      return <NoPage />;
  }
};

export default Adding;
