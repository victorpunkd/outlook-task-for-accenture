import React, { Component } from "react";
import "./Folder.css";

export class Folder extends Component {
  render() {
    const { folderId, folderName, selectedFolderId } = this.props;
    return (
      <div
        key={folderId}
        className="folderBody"
        onClick={() => this.props.folderClicked(folderId)}
      >
        <div
          className={`folderName action ${
            selectedFolderId === folderId ? "activeFolder" : ""
          }`}
        >
          {folderName}
          <span className="unreadMailNumbers">
            {this.props.countOfUnreadMails === 0
              ? ""
              : this.props.countOfUnreadMails}
          </span>
        </div>
      </div>
    );
  }
}

export default Folder;
