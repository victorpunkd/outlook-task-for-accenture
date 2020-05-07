import React, { Component } from "react";
import "./FolderSection.css";
import Folder from "../Folder/Folder";

export class FolderSection extends Component {
  handleFolderClick = (folderId) => {
    this.props.FolderClicked(folderId);
  };

  handleCreateFolderClick = () => {
    let folderName = prompt("New Folder Name", "");
    if (folderName === null) return;
    if (folderName.trim() === "") {
      alert("Not a valid folder name");
      return;
    }
    this.props.createNewFolder(folderName);
  };

  getCountOfUnreadMails = (folderId) => {
    let mailDetails = this.props.mailDetails.filter(
        (data) => data.folderId === folderId
      ),
      i = 0,
      count = 0;
    if (mailDetails.length === 0) return 0;

    while (i < mailDetails[0].mailDetails.length) {
      if (mailDetails[0].mailDetails[i].unread === true) count++;
      i++;
    }
    return count;
  };

  render() {
    const { folderDataPass, selectedFolderId } = this.props;
    return (
      <div className="folderSectionContainer">
        <div className="folderHeader action">
          <i className="fa fa-angle-down"></i> Folders
        </div>
        {folderDataPass.map((data) => (
          <Folder
            key={data.id}
            folderId={data.id}
            folderName={data.folderName}
            selectedFolderId={selectedFolderId}
            countOfUnreadMails={this.getCountOfUnreadMails(data.id)}
            folderClicked={this.handleFolderClick}
          />
        ))}
        <div
          className="createFolderButton iconColor action"
          onClick={this.handleCreateFolderClick}
        >
          + Create a new folder
        </div>
      </div>
    );
  }
}

export default FolderSection;
