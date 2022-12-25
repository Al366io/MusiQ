import { Link, useParams } from "react-router-dom";
import './styles/Adder.css'
import AnimatedBackground from "../components/AnimatedBackground";

const Adder = () => {

  let {id} = useParams()

  return (
    <div id="adding-background">
      <AnimatedBackground/>
      <div id="adder-container">
        <h2 id="party-presenter">Party #{id}</h2>
        <Link to={`/adding/${id}`} className="join-party">Join the Party</Link>
        <Link to={`/adding/${id}`} className="join-party join-under">As Guest</Link>
      </div>
    </div>
  );
};

export default Adder;