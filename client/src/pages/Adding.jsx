import { useParams } from "react-router-dom";
import "./styles/Adding.css";
import Track from "../components/Adding/Track";
import NextTrack from "../components/Adding/NextTrack";
import AddButton from "../components/Adding/AddButton";
import { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import NoPage from "./NoPage";
import Navbar from "../components/Navbar";
import {
  getOwnerParty,
  checkRoom,
  getSocketRoomId,
  postAddedSong,
  playNext,
} from "../ApiServices";

const Adding = () => {
  // REF HOOKS
  const playingRef = useRef("");
  const queueLength = useRef(0);
  const nextNext = useRef("");

  // STATE HOOKS
  const [BGcolor, setBGColor] = useState("#000");
  const [queue, setQueue] = useState([]);
  const [currentlyPlaying, setCurrentlyPlaying] = useState({ "": "" });
  const [exists, setExist] = useState(true);
  const [ownerName, setOwnerName] = useState("");
  let [atProps, setAtProps] = useState({});
  let [remainingTime, setRemainingTime] = useState(10000);

  let { id } = useParams();

  const handleNext = () => {
    if (queue[0].id) {
      sendNewPlaying(queue[0]);
    }
  };

  useEffect(() => {
    checkRoom(id).then((response) => setExist(response));

    const socket = io("http://localhost:3001");
    socket.on("connect_error", () => {
      setTimeout(() => socket.connect(), 500);
    });

    async function fetchSocketRoomId() {
      const socketRoomId = await getSocketRoomId(id);
      socket.emit("join-room", socketRoomId);
    }
    fetchSocketRoomId();

    socket.on("queue", (data) => {
      setRemainingTime(data[0].duration - data[0].progress);

      const renderNext = () => {
        setCurrentlyPlaying(data[0]);
        playingRef.current = data[0].id;
      };

      const renderQueue = () => {
        setQueue(data.slice(1));
        nextNext.current = data[1].id;
        queueLength.current = data.length;
      };

      if (data[0].id !== playingRef.current) {
        renderNext();
      }
      if(data[1] && data[1].id !== nextNext.current){
        console.log(data)
        renderQueue();
      }
    });

    // UNCOMMENT THIS LINE AFTER STYLING
    socket.on("disconnect", () => setCurrentlyPlaying({ error: "error" }));

    // FOR SOME REASON, THIS CREATES TOO MANY REQUESTS
    getOwnerParty(id).then((response) => setOwnerName(response));

    setAtProps({
      1: `${rand(40, 20)}% ${rand(20, 10)}%`,
      2: `${rand(80, 10)}% ${rand(0, 0)}%`,
      3: `${rand(0, 0)}% ${rand(50, 20)}%`,
      4: `${rand(80, 10)}% ${rand(50, 20)}%`,
    });
  }, []);

  useEffect(() => {
    if (remainingTime < 6000) {
      if (queue[0] && queue[0].id && queue[0].id !== nextNext.current) {
        console.log(queue)
        sendNewPlaying(queue[0]);
      }
    }
  }, [remainingTime]);

  const sendNewPlaying = (nextSong) => {
    playNext(id, nextSong.id);
  };

  const addSongFunction = (song) => {
    //call apiservices on song id passed here
    // console.log(song);
    postAddedSong(song.name, song.artist, song.image, song.id, id);
  };

  // HELPER FUNTION TO MODIFY GRADIENT SMOOTHLY
  const rand = (input, variance) => {
    return Math.round(Math.random() * variance) + input;
  };

  if (exists) {
    return (
      <>
        <div id="dash-back" style={{ backgroundColor: `${BGcolor.avg}` }}>
          <div
            className="adding-inner-container"
            style={
              BGcolor.full && BGcolor.full.length >= 3 && BGcolor.full[3]
                ? {
                    backgroundColor: `${BGcolor.avg}`,
                    background: `radial-gradient(at ${atProps[1]}, ${BGcolor.full[0].hex} 0px, transparent 50%), radial-gradient(at ${atProps[2]}, ${BGcolor.full[1].hex} 0px, transparent 50%),radial-gradient(at ${atProps[3]}, ${BGcolor.full[2].hex} 0px, transparent 50%), radial-gradient(at ${atProps[4]}, ${BGcolor.full[3].hex} 0px, transparent 50%)`,
                  }
                : {
                    backgroundColor: `${BGcolor.avg}`,
                  }
            }
          >
            <Navbar transparent={true} />
            <div id="top-adding-container">
              <h3 id="adding-dash">{ownerName + "'s Room"}</h3>
              <h6 id="sub-header-adding">#{id}#</h6>
              <div className="next-track-container">
                <div className="adding-container">
                  <div id="search-container">
                    <AddButton id={id} setter={addSongFunction} />
                  </div>
                  <NextTrack
                    currentlyPlaying={currentlyPlaying}
                    BGsetter={setBGColor}
                  />
                </div>
              </div>
              <div className="track-list-container">
                {!queue.length ? (
                  <h1> No songs in queue </h1>
                ) : (
                  queue.map((song) => {
                    return song !== queue[queue.length - 1] ? (
                      <Track key={song.id} song={song} partyId={id} />
                    ) : (
                      <Track
                        key={song.id}
                        song={song}
                        partyId={id}
                        last={true}
                      />
                    );
                  })
                )}
              </div>
            </div>
            <button
              style={{ width: "50px", height: "25px" }}
              onClick={handleNext}
            >
              Next
            </button>
          </div>
        </div>
      </>
    );
  } else {
    return <NoPage />;
  }
};

export default Adding;
