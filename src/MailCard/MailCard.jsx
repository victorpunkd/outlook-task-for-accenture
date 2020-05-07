import React from "react";
import "./MailCard.css";

function MailCard(props) {
  const {
    mId,
    sendersId,
    subject,
    content,
    recievedTime,
    unread,
  } = props.mailData;
  return (
    <div className={`mailCard w3-row ${unread && "unreadMail"} action`}>
      <div
        onClick={() => props.mailClicked(mId)}
        className="mailCardContainer w3-col"
        style={{ width: "80%" }}
      >
        <div className="mailSenderId textWrap">{sendersId}</div>
        <div className="mailSubject textWrap">{subject}</div>
        <div className="mailContent textWrap">{content}</div>
      </div>
      <div className="w3-col" style={{ width: "20%" }}>
        <div className="actionButtons">
          {!unread && (
            <span
              className="actionIcons"
              onClick={() => props.unreadMailClicked(mId)}
            >
              <i className="fa fa-envelope" aria-hidden="true"></i>
            </span>
          )}
          <span
            className="actionIcons"
            onClick={() => props.deleteMailClicked(mId)}
          >
            <i className="fa fa-trash" aria-hidden="true"></i>
          </span>
          <span
            className="actionIcons"
            onClick={() =>
              props.flagMailClicked(
                mId,
                props.mailData.flag === undefined ||
                  props.mailData.flag === false
                  ? false
                  : true
              )
            }
          >
            <i
              className={`fa fa-flag ${
                props.mailData.flag === undefined ||
                props.mailData.flag === false
                  ? ""
                  : "w3-text-red"
              }`}
              aria-hidden="true"
            ></i>
          </span>
        </div>
        <div className="mailReceievedTime">{recievedTime}</div>
      </div>
    </div>
  );
}

export default MailCard;
