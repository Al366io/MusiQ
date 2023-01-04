import React from "react";
import { Link } from "react-router-dom";
import "./styles/navbar.css";

function Navbar() {


  return (
    <div id="main-container-nav">
      <Link to='/' className="musiq" id="nav-logo">MusiQ</Link>
    </div>
  )
};

export default Navbar;