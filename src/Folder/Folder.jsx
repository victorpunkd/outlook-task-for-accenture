import React from "react";
import "./Folder.css";

function Folder(props) {
  const { folderId, folderName, selectedFolderId } = props;
  return (
    <div
      key={folderId}
      className="folderBody"
      onClick={() => props.folderClicked(folderId)}
    >
      <div
        className={`folderName action ${
          selectedFolderId === folderId && "activeFolder"
        }`}
      >
        {folderName}
        <span className="unreadMailNumbers">
          {props.countOfUnreadMails === 0 ? "" : props.countOfUnreadMails}
        </span>
      </div>
    </div>
  );
}

export default Folder;
