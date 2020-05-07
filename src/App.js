import React, { Component } from "react";
import "./App.css";
import NavBar from "./NavBar/NavBar";
import ActionBar from "./ActionBar/ActionBar";
import { FolderSection } from "./FolderSection/FolderSection";
import MailLists from "./MailLists/MailLists";
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
      mailListOption: "All",
      filterMailListOptionsShow: false,
      currentFilter: "",
    };
  }
  componentDidMount() {
    this.fetchFolderData();
    this.fetchInboxData();
  }

  fetchFolderData = () => {
    fetch(
      "https://s3.ap-south-1.amazonaws.com/victordeb.me-files/outlook-for-accenture-files/folder.json"
    )
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
    fetch(
      "https://s3.ap-south-1.amazonaws.com/victordeb.me-files/outlook-for-accenture-files/inbox.json"
    )
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
    fetch(
      "https://s3.ap-south-1.amazonaws.com/victordeb.me-files/outlook-for-accenture-files/spam.json"
    )
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

  //All the ActionBar events starts here

  handleMarkAllReadClick = () => {
    let copyofMaildata = this.state.mailData;
    for (let i in copyofMaildata) {
      if (copyofMaildata[i].folderId === this.state.currentSelectedFolder) {
        for (let j in copyofMaildata[i].mailDetails) {
          copyofMaildata[i].mailDetails[j].unread = false;
        }
        break;
      }
    }
    this.setState({ mailData: copyofMaildata });
  };

  //All the ActionBar events ends here

  //All the folder actions starts here

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

  //All the folder actions ends here

  //All mail lists non component action starts here

  handleAllMaillistOptionClick = () => {
    this.setState({ mailListOption: "All" });
    let tempData = this.state.mailData.filter(
      (element) => element.folderId === this.state.currentSelectedFolder
    )[0].mailDetails;
    this.setState({ currentMails: tempData });
  };

  handleUnreadMaillistOptionClick = () => {
    this.setState({ mailListOption: "Unread" });
    let tempData = this.state.mailData
      .filter(
        (element) => element.folderId === this.state.currentSelectedFolder
      )[0]
      .mailDetails.filter((data) => data.unread === true);
    this.setState({ currentMails: tempData });
  };

  handleRemoveSelectedFilterClick = () => {
    this.setState({ currentFilter: "" });
    this.setState({
      currentMails: this.state.mailData.filter(
        (data) => data.folderId === this.state.currentSelectedFolder
      )[0].mailDetails,
    });
  };

  handleFilterMailListOptionClick = () => {
    this.setState({
      filterMailListOptionsShow: !this.state.filterMailListOptionsShow,
    });
  };

  handleApplyFilterByFlaggedClick = () => {
    this.setState({
      filterMailListOptionsShow: !this.state.filterMailListOptionsShow,
    });
    this.setState({
      currentMails: this.state.mailData
        .filter((data) => data.folderId === this.state.currentSelectedFolder)[0]
        .mailDetails.filter((data) => data.flag === true),
      currentFilter: "By Flagged",
    });
  };

  //All mail litsts non component action ends here

  //All mail litsts component action starts here

  handleUnreadMailClick = (mailId) => {
    this.setState({
      mailData: this.updateMailPropertyValue(
        mailId,
        this.state.mailData,
        "unread",
        true,
        this.state.currentSelectedFolder
      ),
    });
  };

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
      mailData: this.updateMailPropertyValue(
        mailId,
        this.state.mailData,
        "flag",
        !currentValue,
        this.state.currentSelectedFolder
      ),
    });
    this.handleRemoveSelectedFilterClick();
  };

  handleMailClick = (mailId) => {
    this.setState({
      mailData: this.updateMailPropertyValue(
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

  //All mail litsts component action ends here

  //All mail details actions start here

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
    this.setState({
      mailData: updatedData,
      displayMail: [],
      currentMails: this.state.mailData.filter(
        (element) => element.folderId === 1
      )[0].mailDetails,
      currentSelectedFolder: 1,
    });
  };
  //All mail details actions end here

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

  updateMailPropertyValue = (
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
          <ActionBar markAllReadClicked={this.handleMarkAllReadClick} />
          <div className="workArea w3-row">
            <div className="w3-col folders" style={{ width: "17%" }}>
              {isFolderDataLoaded && isInboxDataLoaded && isSpamDataLoaded ? (
                <FolderSection
                  folderDataPass={folderData}
                  selectedFolderId={this.state.currentSelectedFolder}
                  FolderClicked={this.handleFolderClicked}
                  createNewFolder={this.handleCreateNewFolderClick}
                  mailDetails={this.state.mailData}
                />
              ) : (
                <div>Loading...</div>
              )}
            </div>
            <div className="w3-col mailLists" style={{ width: "25%" }}>
              <div className="w3-row mailListOptions">
                <div
                  onClick={this.handleAllMaillistOptionClick}
                  className={`w3-col option action ${
                    this.state.mailListOption === "All" && "optionActive"
                  }`}
                  style={{ width: "20%" }}
                >
                  All
                </div>
                <div
                  onClick={this.handleUnreadMaillistOptionClick}
                  className={`w3-col option action ${
                    this.state.mailListOption === "Unread" && "optionActive"
                  }`}
                  style={{ width: "25%" }}
                >
                  Unread
                </div>
                <div
                  className="w3-col filter action iconColor"
                  style={{ width: "55%" }}
                >
                  {this.state.currentFilter !== "" && (
                    <span
                      onClick={this.handleRemoveSelectedFilterClick}
                      className="w3-border w3-border-black"
                      style={{ marginRight: 10, padding: 2 }}
                    >
                      {this.state.currentFilter}{" "}
                      <i className="fa fa-times w3-text-red"></i>
                    </span>
                  )}
                  <span onClick={this.handleFilterMailListOptionClick}>
                    Filter <i className="fa fa-angle-down"></i>
                  </span>
                  <div
                    onClick={this.handleApplyFilterByFlaggedClick}
                    className={`filterOptionsMailsList w3-card ${
                      !this.state.filterMailListOptionsShow && "w3-hide"
                    }`}
                  >
                    <div>
                      <i
                        className="fa fa-flag w3-text-red"
                        aria-hidden="true"
                      ></i>{" "}
                      By Flagged
                    </div>
                  </div>
                </div>
              </div>
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
