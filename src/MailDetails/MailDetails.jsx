import React, { Component } from "react";
import "./MailDetails.css";
import { FolderSelect } from "../FolderSelect/FolderSelect";

export class MailDetails extends Component {
  constructor() {
    super();
    this.state = {
      foldeSelectShow: false,
    };
  }
  moveToFolderClicked = () => {
    this.setState({ foldeSelectShow: !this.state.foldeSelectShow });
  };

  moveToFolderNameClick = (folderId, folderName) => {
    this.setState({ foldeSelectShow: false });
    this.props.moveToFolderNameClick(
      folderId,
      this.props.mailToDisplay[0].mId,
      folderName
    );
  };

  render() {
    const { mailToDisplay } = this.props;
    return (
      <div className="mailDetailsContainer">
        {mailToDisplay.length <= 0 ? (
          <div className="noMailToShow">
            <div className="noMailIcon">
              <i className="fa fa-envelope iconColor" aria-hidden="true"></i>
            </div>
            <div style={{ color: "gray" }}>Select an item to read</div>
            <div style={{ color: "#0778d4" }}>
              Click here to always select the first item in the list
            </div>
          </div>
        ) : (
          <div className="mailDetailsBody">
            <div className="sendersInfo w3-row">
              <div className="w3-col userIcon" style={{ width: "15%" }}>
                <i className="fa fa-user" aria-hidden="true"></i>
              </div>
              <div className="w3-col" style={{ width: "50%" }}>
                <div className="sendersId">{mailToDisplay[0].sendersId}</div>
                <div className="mailSubjectInMailBody iconColor">
                  {mailToDisplay[0].subject}
                </div>
              </div>
              <div
                className="w3-col"
                style={{ width: "20%", textAlign: "right" }}
              >
                <button
                  onClick={this.moveToFolderClicked}
                  className="w3-btn w3-blue w3-small"
                >
                  Move To folder
                </button>
                <div className="folderNames">
                  {this.state.foldeSelectShow && (
                    <FolderSelect
                      folderData={this.props.folderData}
                      moveToFolderNameClicked={this.moveToFolderNameClick}
                      currentFolderId={this.props.currentFolderId}
                    />
                  )}
                </div>
              </div>
              <div
                className="w3-col"
                style={{ width: "15%", textAlign: "right" }}
              >
                <i class="fa fa-ellipsis-v action" aria-hidden="true"></i>
              </div>
            </div>
            <div className="mailContentInMailBody">
              {mailToDisplay[0].content.replace('"', "")}
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default MailDetails;
