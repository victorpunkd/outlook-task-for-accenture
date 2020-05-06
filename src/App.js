import React, { Component } from "react";
import "./App.css";
import { NavBar } from "./NavBar/NavBar";
import { ActionBar } from "./ActionBar/ActionBar";
import { FolderSection } from "./FolderSection/FolderSection";
import { MailLists } from "./MailLists/MailLists";
import { MailDetails } from "./MailDetails/MailDetails";

export class App extends Component {
  constructor() {
    super();
    this.state = {
      isInboxDataLoaded: false,
      isSpamDataLoaded: false,
      folderData: [],
      mailData: [],
      isFolderDataLoaded: false,
      currentSelectedFolder: 1,
      currentMails: [],
      displayMail: [],
    };
  }
  componentDidMount() {
    this.fetchFolderData();
    this.fetchInboxData();
  }

  fetchFolderData = () => {
    fetch("https://outlook-task.s3.ap-south-1.amazonaws.com/data/folder.json")
      .then((res) => res.json())
      .then(
        (data) => {
          this.setState({
            folderData: data,
            isFolderDataLoaded: true,
          });
        },
        (error) => {
          this.setState({
            error,
          });
        }
      );
  };

  fetchInboxData = () => {
    fetch("https://outlook-task.s3.ap-south-1.amazonaws.com/data/inbox.json")
      .then((res) => res.json())
      .then(
        (data) => {
          let tempData = this.state.mailData;
          tempData.push({
            folderId: 1,
            folderName: "Inbox",
            mailDetails: data,
          });
          this.setState(
            {
              mailData: tempData,
              isInboxDataLoaded: true,
              currentMails: data,
            },
            () => {
              this.fetchSpamData();
            }
          );
        },
        (error) => {
          this.setState({
            error,
          });
        }
      );
  };

  fetchSpamData = () => {
    fetch("https://outlook-task.s3.ap-south-1.amazonaws.com/data/spam.json")
      .then((res) => res.json())
      .then(
        (data) => {
          let tempData = this.state.mailData;
          tempData.push({ folderId: 4, folderName: "Spam", mailDetails: data });
          this.setState({
            mailData: tempData,
            isSpamDataLoaded: true,
          });
        },
        (error) => {
          this.setState({
            error,
          });
        }
      );
  };

  //All the folder actions start

  handleFolderClicked = (folderId) => {
    let mailsInsideFolder = this.state.mailData.filter(
      (element) => element.folderId === folderId
    );
    this.setState({
      currentMails:
        mailsInsideFolder[0] === undefined
          ? []
          : mailsInsideFolder[0].mailDetails,
      currentSelectedFolder: folderId,
      displayMail: [],
    });
  };

  handleCreateNewFolderClick = (folderName) => {
    let folderId = Date.now();
    let tempData = this.state.folderData;
    tempData.push({ id: folderId, folderName: folderName });
    this.setState({ folderData: [...tempData] });
  };

  //All the folder actions end

  handleDeleteMailClick = (mailId) => {
    if (this.state.currentSelectedFolder === 3) {
      if (window.confirm("It will be permenantly deleted ?") === false) return;
    }
    let deletedMail = this.removeMailFromFolder(
      mailId,
      this.state.currentSelectedFolder
    );
    if (this.state.currentSelectedFolder !== 3) {
      let newData = this.addMailToFolder(deletedMail, 3, "Deleted");
      this.setState({ mailData: newData }, () => {
        let tempData = this.state.mailData.filter(
          (data) => data.folderId === this.state.currentSelectedFolder
        );
        this.setState({
          currentMails: tempData[0].mailDetails,
        });
      });
    } else {
      this.setState({
        currentMails: this.state.mailData.filter(
          (data) => data.folderId === this.state.currentSelectedFolder
        ),
      });
    }
  };

  handleFlagMailClick = (mailId, currentValue) => {
    this.setState({
      mailData: this.changeMailProperty(
        mailId,
        this.state.mailData,
        "flag",
        !currentValue,
        this.state.currentSelectedFolder
      ),
    });
  };

  handleUnreadMailClick = (mailId) => {
    this.setState({
      mailData: this.changeMailProperty(
        mailId,
        this.state.mailData,
        "unread",
        true,
        this.state.currentSelectedFolder
      ),
    });
  };

  handleMailClick = (mailId) => {
    this.setState({
      mailData: this.changeMailProperty(
        mailId,
        this.state.mailData,
        "unread",
        false,
        this.state.currentSelectedFolder
      ),
    });
    this.setState({
      displayMail: this.state.mailData
        .filter((data) => data.folderId === this.state.currentSelectedFolder)[0]
        .mailDetails.filter((data) => data.mId === mailId),
    });
  };

  addMailToFolder(mailDetails, folderId, folderName) {
    let tempData = this.state.mailData;
    let mailFolder = tempData.filter((data) => data.folderId === folderId);
    if (mailFolder[0] === undefined) {
      tempData.push({
        folderId: folderId,
        folderName: folderName,
        mailDetails: [...mailDetails],
      });
    } else {
      tempData = tempData.filter((data) => data.folderId !== folderId);
      mailFolder[0].mailDetails.push(...mailDetails);
      tempData.push(...mailFolder);
    }
    return tempData;
  }

  removeMailFromFolder(mailId, folderId) {
    let tempData = this.state.mailData;
    let mailFolder = tempData.filter((data) => data.folderId === folderId);
    tempData = tempData.filter((data) => data.folderId !== folderId);
    let deletedMail = mailFolder[0].mailDetails.filter(
      (data) => data.mId === mailId
    );
    mailFolder[0].mailDetails = mailFolder[0].mailDetails.filter(
      (data) => data.mId !== mailId
    );
    tempData.push(...mailFolder);
    this.setState({ mailData: tempData });
    return deletedMail;
  }

  changeMailProperty = (
    mailId,
    mailData,
    propertyName,
    propertyValue,
    currentFolder
  ) => {
    let i = 0,
      operationDone = false;
    while (i < mailData.length) {
      if (mailData[i].folderId === currentFolder) {
        let j = 0;
        while (j < mailData[i].mailDetails.length) {
          if (mailData[i].mailDetails[j].mId === mailId) {
            mailData[i].mailDetails[j][`${propertyName}`] = propertyValue;
            operationDone = true;
            break;
          }
          j++;
        }
      }
      if (operationDone === true) break;
      i++;
    }
    return mailData;
  };

  handleMoveToFolderNameClick = (
    destinationFolderId,
    mailIdtoMove,
    folderName
  ) => {
    let mailtoBeMoved = this.removeMailFromFolder(
      mailIdtoMove,
      this.state.currentSelectedFolder
    );
    let updatedData = this.addMailToFolder(
      mailtoBeMoved,
      destinationFolderId,
      folderName
    );
    this.setState(
      {
        mailData: updatedData,
        displayMail: [],
        currentMails: this.state.mailData.filter(
          (element) => element.folderId === 1
        )[0].mailDetails,
      },
      () => console.log(this.state.currentMails)
    );
  };
  render() {
    const {
      folderData,
      isFolderDataLoaded,
      isInboxDataLoaded,
      isSpamDataLoaded,
      error,
      currentMails,
    } = this.state;
    if (error) {
      return <div>Something went wrong please refresh the page</div>;
    } else {
      return (
        <div className="App">
          <NavBar />
          <ActionBar />
          <div className="workArea w3-row">
            <div className="w3-col folders" style={{ width: "17%" }}>
              {isFolderDataLoaded && isInboxDataLoaded && isSpamDataLoaded ? (
                <FolderSection
                  folderDataPass={folderData}
                  FolderClicked={this.handleFolderClicked}
                  createNewFolder={this.handleCreateNewFolderClick}
                  mailDetails={this.state.mailData}
                />
              ) : (
                <div>Loading...</div>
              )}
            </div>
            <div className="w3-col mailLists" style={{ width: "25%" }}>
              {isInboxDataLoaded ? (
                <MailLists
                  currentMails={currentMails}
                  unreadMailClicked={this.handleUnreadMailClick}
                  deleteMailClicked={this.handleDeleteMailClick}
                  flagMailClicked={this.handleFlagMailClick}
                  mailClicked={this.handleMailClick}
                />
              ) : (
                <div>Loading...</div>
              )}
            </div>
            <div className="w3-col mailDetails" style={{ width: "58%" }}>
              <MailDetails
                mailToDisplay={this.state.displayMail}
                folderData={this.state.folderData}
                moveToFolderNameClick={this.handleMoveToFolderNameClick}
                currentFolderId={this.state.currentSelectedFolder}
              />
            </div>
          </div>
        </div>
      );
    }
  }
}

export default App;
