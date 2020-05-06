import React, { Component } from "react";
import "./MailLists.css";
import { MailCard } from "../MailCard/MailCard";

export class MailLists extends Component {
  render() {
    const { currentMails } = this.props;
    return (
      <div className="mailListsContainer">
        {currentMails.length > 0 ? (
          currentMails.map((data) => (
            <MailCard
              mailData={data}
              unreadMailClicked={this.props.unreadMailClicked}
              deleteMailClicked={this.props.deleteMailClicked}
              flagMailClicked={this.props.flagMailClicked}
              mailClicked={this.props.mailClicked}
            />
          ))
        ) : (
          <div>No mail under this folder</div>
        )}
      </div>
    );
  }
}

export default MailLists;
