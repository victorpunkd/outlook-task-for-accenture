import React from "react";
import "./FolderSelect.css";

function FolderSelect(props) {
  return (
    <div className="folderSelectContainer w3-card">
      {props.folderData
        .filter((data) => data.id !== props.currentFolderId)
        .map((data) => (
          <div
            key={data.id}
            className="folderName action"
            onClick={() =>
              props.moveToFolderNameClicked(data.id, data.folderName)
            }
          >
            {data.folderName}
          </div>
        ))}
    </div>
  );
}

export default FolderSelect;
