import { Link, useParams } from "react-router-dom";
import './styles/Adder.css'
import AnimatedBackground from "../components/AnimatedBackground";
import LoginButton from '../components/LoginButton'
import { useAuth0 } from "@auth0/auth0-react";

const Adder = () => {

  const { user, isAuthenticated, loginWithRedirect } = useAuth0();

  let {id} = useParams()

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
};

export default Adder;