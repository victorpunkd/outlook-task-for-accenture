import React from "react";
import "./NavBar.css";

function NavBar(props) {
  return (
    <div className="navBarContent w3-row">
      <div className="actionIcon w3-col" style={{ width: 50 }}>
        <i className="fa fa-navicon icon action"></i>
      </div>
      <div className="w3-rest appName">Outlook Mail</div>
    </div>
  );
}

export default NavBar;
