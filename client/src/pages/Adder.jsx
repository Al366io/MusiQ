import { Link, useParams } from "react-router-dom";
import './styles/Adder.css'
import AnimatedBackground from "../components/AnimatedBackground";
import LoginButton from '../components/LoginButton'
import { checkRoom } from "../ApiServices";
import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";

const Adder = () => {

  const [exists, setExist] = useState(false)
  const { user, isAuthenticated, loginWithRedirect } = useAuth0();

  let {id} = useParams()

  checkRoom(id).then(response => {setExist(response)})

  if (exists) {

    return (
      <div id="adding-background">
        <AnimatedBackground/>
        <div id="adder-container">
          <h2 id="party-presenter">Party #{id}</h2>
          {isAuthenticated ?
          <Link to={`/adding/${id}`} className="join-party">Join as {user.given_name}</Link>
          :
          <button className="join-party" onClick={() => loginWithRedirect()}>Join the Party</button>
          }
          <Link to={`/adding/${id}`} className="join-party join-under">As Guest</Link>
        </div>
      </div>
    );
  } else {
    return (
      <span>Nope</span>
    )
  }
};

export default Adder;