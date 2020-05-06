import React, { Component } from "react";
import "./ActionBar.css";

export class ActionBar extends Component {
  render() {
    return (
      <div className="actionBarContent w3-row">
        <div
          className="w3-col section"
          style={{ width: "17%", backgroundColor: "#DCECF9" }}
        >
          <input className="searchInput" placeholder="Search Mail and People" />{" "}
          <i className="fa fa-search iconColor action" aria-hidden="true"></i>
        </div>
        <div className="w3-col section w3-row" style={{ width: "83%" }}>
          <div className="action w3-col" style={{ width: "8%" }}>
            <i className="fa fa-plus-circle iconColor"></i> New |{" "}
            <i className="fa fa-angle-down"></i>
          </div>
          <div
            className="action w3-col"
            style={{ marginLeft: "0%", width: "50%" }}
          >
            <i
              className="fa fa-envelope-open-o iconColor"
              aria-hidden="true"
            ></i>{" "}
            Mark all as read
          </div>
        </div>
      </div>
    );
  }
}

export default ActionBar;
