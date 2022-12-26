import "./styles/Home.css";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import LoginButton from "../components/LoginButton";
import { getTokensFromDb } from "../ApiServices";

const Home = () => {
  const { logout, user, isAuthenticated } = useAuth0();
  const [isSpotifyLoggedIn, setIsSpotifyLoggedIn] = useState(false);

  // when state of user changes (so basically when someone logs in)
  // call the db to see if they have a token
  useEffect(() => {
    getTokenAndUpdateStatus();
  }, [user]);

  useEffect(() => {
    handleTokenFromQueryParams();
  }, []);

  const getTokenAndUpdateStatus = async () => {
    if (user) {
      let newToken = await getTokensFromDb(user.email);
      console.log(newToken);
      if (newToken) setIsSpotifyLoggedIn(true);
      else setIsSpotifyLoggedIn(false);
    }
  }

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
      // TODO : try to validate access token before actually setting isSpotifyLoggedIn to true ??
      storeTokenData(accessToken, refreshToken, expirationDate);
      setIsSpotifyLoggedIn(true);
    }
    // now if URL contains the accessToken, delete the query params
    if (window.location.href.includes("accessToken")) {
      window.history.pushState({}, document.title, window.location.pathname);
    }

    // AT THIS POINT WE EITHER HAVE ACCESS TOKEN AND REFRESH TOKEN BOTH IN SESSION STORAGE FOR
    // FAST USAGE FOR OWNER AND IN DATABASE, LINKED TO USER EMAIL.
    // When user then create a party, partyId will be inserted in database in the same object that holds
    // user_email and accessToken so we can use the access token when using that partyId
  };

  return (
    <div id="home-wrapper">
      <div id="top-wrapper">
        <h1 id="top-header">
          Welcome to <span className="musiq">MusiQ</span>
        </h1>
        {!isAuthenticated ? (
          <LoginButton text={"Get Started"} />
        ) : (
          <div id="logged">
            <span id="hey-user">Hey, {user.given_name}</span>
            {isSpotifyLoggedIn ? (
              <Link to="/owner" className="nologin">
                Create a Party?
              </Link>
            ) : (
              <a href={`http://localhost:3001/connectspotify/${user.email}`}>
                CONNECT YOUR SPOTIFY
              </a>
            )}
            <button
              className="nologin"
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
        viewBox="0 0 1440 320"
      >
        <path
          fill="#52B69A"
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
        <img src="" alt="User-view queue" />
      </div>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
        <path
          fill="#52B69A"
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
      <Footer />
    </div>
  );
};

export default Home;
