import React from "react";
import "./MailLists.css";
import MailCard from "../MailCard/MailCard";

function MailLists(props) {
  const { currentMails } = props;
  return (
    <div className="mailListsContainer">
      {currentMails.length > 0 ? (
        currentMails.map((data) => (
          <MailCard
            key={data.mId}
            mailData={data}
            unreadMailClicked={props.unreadMailClicked}
            deleteMailClicked={props.deleteMailClicked}
            flagMailClicked={props.flagMailClicked}
            mailClicked={props.mailClicked}
          />
        ))
      ) : (
        <div className="loading">No mail under this folder</div>
      )}
    </div>
  );
}

export default MailLists;
