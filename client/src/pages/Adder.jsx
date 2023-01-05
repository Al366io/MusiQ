import { Link, useParams } from "react-router-dom";
import './styles/Adder.css'
import AnimatedBackground from "../components/AnimatedBackground";
import { checkRoom } from "../ApiServices";
import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";
import NoPage from "./NoPage";

const Adder = () => {

  const { user, isAuthenticated, loginWithRedirect } = useAuth0();
  const [exists, setExist] = useState(true)

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
          <Link to='/' id="adder-back-home">Go Back Home ?</Link>
        </div>
      </div>
    );
  } else {
    return (
      <NoPage/>
    )
  }
};

export default Adder;