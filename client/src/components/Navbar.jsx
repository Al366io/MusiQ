import React from "react";
import { Link } from "react-router-dom";
import "./styles/navbar.css";

function Navbar({transparent = false}) {


  return (
    <div className={`main-container-nav${transparent ? ' transparent-nav' : ''}`}>
      <Link to='/' className="musiq" id="nav-logo">MusiQ</Link>
    </div>
  )
};

export default Navbar;