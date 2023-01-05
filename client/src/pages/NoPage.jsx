import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import './styles/NoPage.css'

const NoPage = () => {
  return (
    <>
    <Navbar />
    <div id="error-container">
      <h3 id="error-head">404</h3>
      <h3 id="error-subhead">You're looking for the wrong queue</h3>
      <Link to='/' id="error-back-home">Go Back Home ?</Link>
    </div>
    </>
  );
};

export default NoPage;