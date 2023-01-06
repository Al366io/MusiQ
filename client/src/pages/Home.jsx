import "./styles/Home.css";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import LoginButton from "../components/LoginButton";
import {
  getTokensFromDb,
  getSpotifyUserInfo,
  getUserRoom,
} from "../ApiServices";

const Home = () => {

  const { logout, user, isAuthenticated } = useAuth0();
  const [isSpotifyLoggedIn, setIsSpotifyLoggedIn] = useState(false);
  const [spotifyUser, setSpotifyUser] = useState({});
  const [userRoom, serUserRoom] = useState("");
  const [selectOption, setSelectOption] = useState("");
  // when state of user changes (so basically when someone logs in)
  // call the db to see if they have a token
  useEffect(() => {
    getTokenAndUpdateStatus();
  }, [user]);

  useEffect(() => {
    console.log(selectOption)
  }, [selectOption]);

  useEffect(() => {
    handleTokenFromQueryParams();
  }, []);

  useEffect(() => {
    // get user info if authenticated
    // this also gets the user Room if it has one
    getUser();
  }, [isSpotifyLoggedIn]);

  const getUser = async () => {
    if (isAuthenticated) {
      let spotiUser = await getSpotifyUserInfo(user.email);
      setSpotifyUser(spotiUser);
      let party = await getUserRoom(user.email);
      serUserRoom(party);
    }
  };
  const getTokenAndUpdateStatus = async () => {
    if (user) {
      let newToken = await getTokensFromDb(user.email);
      if (newToken) setIsSpotifyLoggedIn(true);
      else setIsSpotifyLoggedIn(false);
    }
  };

  // calculate expiration date of token
  const newExpirationDate = () => {
    var expiration = new Date();
    expiration.setHours(expiration.getHours() + 1);
    return expiration;
  };

  //inserts auth token and refresh token in session storage || TODO : Do wee need them here??
  const storeTokenData = async (token, refreshToken, expirationDate) => {
    sessionStorage.setItem("accessToken", token);
    sessionStorage.setItem("refreshToken", refreshToken);
    sessionStorage.setItem("expirationDate", expirationDate);
  };

  // take accessToken and refreshToken from URL and if they are there set IsSpotifyLoggedIn to true
  const handleTokenFromQueryParams = () => {
    const query = new URLSearchParams(window.location.search);
    const accessToken = query.get("accessToken");
    const refreshToken = query.get("refreshToken");
    const expirationDate = newExpirationDate();
    if (accessToken && refreshToken) {
      storeTokenData(accessToken, refreshToken, expirationDate);
      setIsSpotifyLoggedIn(true);
    }
    // now if URL contains the accessToken, delete the query params
    if (window.location.href.includes("accessToken")) {
      window.history.pushState({}, document.title, window.location.pathname);
    }
  };

  return (
    <div id="home-wrapper">
      <div id="top-wrapper">
      <object id="sound-wave" data={process.env.PUBLIC_URL + '/assets/sound_wave.svg'} width="1200" height="300"></object>
      <svg id="top-svg" xmlns="http://www.w3.org/2000/svg" viewBox="220 -30 1140 320"><path fill="#000" fillOpacity="1" d="M0,0L60,53.3C120,107,240,213,360,218.7C480,224,600,128,720,80C840,32,960,32,1080,26.7C1200,21,1320,11,1380,5.3L1440,0L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"></path></svg>        <h1 id="top-header">
          Welcome to <span className="musiq">MusiQ</span>
        </h1>
        {!isAuthenticated ? (
          <LoginButton text={"Get Started"} />
        ) : (
          <div id="logged">
            {isSpotifyLoggedIn ? (
              <span id="hey-user">Hey, {spotifyUser.display_name}</span>
            ) : (
              <span id="hey-user">Hey, {user.given_name}</span>
            )}
            {isSpotifyLoggedIn ? (
              // Here userRoom is the PartId of that users room if it has one already :)
              <>
                {userRoom ?
                <Link className="nologin" to={`/dashboard/${userRoom}`}> GO TO YOUR ROOM </Link>
                : 
              <Link to="/owner" className="nologin">
                Create a Party?
              </Link>
                }
              </>
            ) : (
              <a id="connect-spotify" href={`http://localhost:3001/connectspotify/${user.email}`}>
                CONNECT YOUR SPOTIFY
              </a>
            )}
            <button
            className="logout"
              onClick={() => logout({ returnTo: window.location.origin })}
            >
              LOGOUT
            </button>
          </div>
        )}
      </div>
      <svg
        id="svg-top"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 250"
      >
        <path
          fill="#3d1053"
          fillOpacity="1"
          d="M0,128L40,128C80,128,160,128,240,112C320,96,400,64,480,48C560,32,640,32,720,58.7C800,85,880,139,960,154.7C1040,171,1120,149,1200,128C1280,107,1360,85,1400,74.7L1440,64L1440,0L1400,0C1360,0,1280,0,1200,0C1120,0,1040,0,960,0C880,0,800,0,720,0C640,0,560,0,480,0C400,0,320,0,240,0C160,0,80,0,40,0L0,0Z"
        ></path>
      </svg>
      <div id="section-1">
        <div id="section-1-left">
          <h2 id="section-1-header">
            Create the <span className="perfect">perfect</span> queue for your
            party
          </h2>
          <span id="section-1-subheader">
            With only a few clicks, set up a collective Spotify queue for your
            party where everyone can participate!
            
          </span>
        </div>
        <div id="user-view-container">
        <div id="user-view" 
        style={{
          'background' : `url(${process.env.PUBLIC_URL + '/assets/temp-user-view.png'}`,
          'backgroundOrigin' : 'padding-box',
          'backgroundSize' : 'contain',
          'backgroundRepeat' : 'no-repeat'
          }}></div>
        <div id="user-view-shadow"></div>
        </div>
      </div>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
        <path
          fill="#94457e"
          fillOpacity="1"
          d="M0,128L40,128C80,128,160,128,240,112C320,96,400,64,480,48C560,32,640,32,720,58.7C800,85,880,139,960,154.7C1040,171,1120,149,1200,128C1280,107,1360,85,1400,74.7L1440,64L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"
        ></path>
      </svg>
      <div id="section-2">
        <div id="wrapper-section-2">
          <span className="points-section-2">Connect through Spotify</span>
          <span className="down-arrow">&#8595;</span>
          <span className="points-section-2">Create your party</span>
          <span className="down-arrow">&#8595;</span>
          <span className="points-section-2">Set some ground rules</span>
          <span className="down-arrow">&#8595;</span>
          <span className="points-section-2">Enjoy great MusiQ</span>
        </div>
      </div>
      <div id="section-3">
        <div id="wrapper-left-section-3">
          
          <button 
          className={`option-button-home ${selectOption === 'visibility' ? 'active' : ''}`}
          onClick={(e) => setSelectOption(e.target.value)} 
          value='visibility'>
            Visibility
            </button>
          <button 
          className={`option-button-home ${selectOption === 'join' ? 'active' : ''}`}
          onClick={(e) => setSelectOption(e.target.value)} 
          value='join'>
            Who can join
          </button>
          <button 
          className={`option-button-home ${selectOption === 'genre' ? 'active' : ''}`}
          onClick={(e) => setSelectOption(e.target.value)} 
          value='genre'>
            Genre Respect
          </button>
          <button 
          className={`option-button-home ${selectOption === 'timeout' ? 'active' : ''}`}
          onClick={(e) => setSelectOption(e.target.value)} 
          value='timeout'>
            Duplicate Timeout
          </button>
          <button 
          className={`option-button-home ${selectOption === 'upvote' ? 'active' : ''}`}
          onClick={(e) => setSelectOption(e.target.value)} 
          value='upvote'>
            Upvote/Downvote
          </button>
        </div>
        <div id="wrapper-right-section-3" 
        style={
          selectOption === 'visibility' ?
          {background : "#4e146f"}
          :
          {background : "#4e146f"}
          }>
          <div id="top-phone-home">
            <div id="speaker-phone-home"></div>
            <div id="camera-phone-home"></div>
          </div>
            <span key={selectOption} id="selection-phone">{selectOption}</span>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
