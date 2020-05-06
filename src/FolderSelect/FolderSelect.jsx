import React, { Component } from "react";
import "./FolderSelect.css";

export class FolderSelect extends Component {
  render() {
    return (
      <div className="folderSelectContainer w3-card">
        {this.props.folderData
          .filter((data) => data.id !== this.props.currentFolderId)
          .map((data) => (
            <div
              className="folderName action"
              onClick={() =>
                this.props.moveToFolderNameClicked(data.id, data.folderName)
              }
            >
              {data.folderName}
            </div>
          ))}
      </div>
    );
  }
}

export default FolderSelect;
