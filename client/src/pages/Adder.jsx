import { useParams } from "react-router-dom";
import './styles/Adder.css'

const Adder = () => {

  let {id} = useParams()

  return (
    <div id="adder-wrapper">
      <h1>Adder - Party {id}</h1>
      <ul>Landing Page
        <li>Login or username invention</li>
        <li>Get Started button</li>
      </ul>
      <ul>List Page
        <li>See Playing now</li>
        <li>All List</li>
        <li>Adding Button bottom</li>
      </ul>
    </div>
  );
};

export default Adder;