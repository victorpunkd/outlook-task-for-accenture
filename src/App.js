import React, { Component } from "react";
import "./App.css";
import NavBar from "./NavBar/NavBar";
import ActionBar from "./ActionBar/ActionBar";
import { FolderSection } from "./FolderSection/FolderSection";
import MailLists from "./MailLists/MailLists";
import { MailDetails } from "./MailDetails/MailDetails";
import { ComposeMail } from "./ComposeMail/ComposeMail";

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
      composeMailShow: false,
    };
  }
  componentDidMount() {
    this.fetchFolderData(); //fetching information of pre loaded folders from a json file
    this.fetchInboxData(); //fetching inbox mails from a json file
  }

  fetchFolderData = () => {
    fetch(
      "https://s3.ap-south-1.amazonaws.com/victordeb.me-staticfiles/outlook-for-accenture-files/folder.json"
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
      "https://s3.ap-south-1.amazonaws.com/victordeb.me-staticfiles/outlook-for-accenture-files/inbox.json"
    )
      .then((res) => res.json())
      .then(
        (data) => {
          let tempData = this.state.mailData;
          tempData.push({
            folderId: 1,
            folderName: "Inbox",
            mailDetails: data,
          }); //pushing all the inbox mails in mailData state under inbox folder
          this.setState(
            {
              mailData: tempData,
              isInboxDataLoaded: true,
              currentMails: data,
            },
            () => {
              this.fetchSpamData(); //omce the maildata state is updated then fetching the spam mails
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
      "https://s3.ap-south-1.amazonaws.com/victordeb.me-staticfiles/outlook-for-accenture-files/spam.json"
    )
      .then((res) => res.json())
      .then(
        (data) => {
          let tempData = this.state.mailData;
          tempData.push({ folderId: 4, folderName: "Spam", mailDetails: data }); //pushing spam data in maildta state
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

  //All the compose mail events start here//

  handleSendMail = (to, subject, content) => {
    var d = new Date();
    let mailData = [
      {
        mId: Date.now(),
        sendersName: "",
        sendersId: to,
        unread: false,
        recievedTime: d.toLocaleTimeString(),
        recievedDate: d.toLocaleDateString(),
        subject: subject,
        content: content,
      },
    ];
    this.setState({
      mailData: this.addMailToFolder(mailData, 5, "Sent Items"),
      composeMailShow: false,
    });
  };

  handleSaveDraft = (to, subject, content) => {
    var d = new Date();
    let mailData = [
      {
        mId: Date.now(),
        sendersName: "",
        sendersId: to,
        unread: false,
        recievedTime: d.toLocaleTimeString(),
        recievedDate: d.toLocaleDateString(),
        subject: subject,
        content: content,
      },
    ];
    this.setState({
      mailData: this.addMailToFolder(mailData, 2, "Draft"),
      composeMailShow: false,
    });
  };

  handleCancelComposeMail = () => {
    this.setState({ composeMailShow: false });
  };

  //All the ActionBar events starts here

  handleMarkAllReadClick = () => {
    //will mark all mails read to the current folder
    let copyofMaildata = this.state.mailData;
    for (let i in copyofMaildata) {
      if (copyofMaildata[i].folderId === this.state.currentSelectedFolder) {
        for (let j in copyofMaildata[i].mailDetails) {
          copyofMaildata[i].mailDetails[j].unread = false; //changing unread value of all the mails under the current folder
        }
        break;
      }
    }
    this.setState({ mailData: copyofMaildata }); //setting the updated set
  };

  handleNewMailClick = () => {
    this.setState({ composeMailShow: true });
  };

  //All the ActionBar events ends here

  //All the folder actions starts here

  handleFolderClicked = (folderId) => {
    //open mail
    let mailsInsideFolder = this.state.mailData.filter(
      (data) => data.folderId === folderId //selecting all the mails under current folder
    );
    this.setState({
      currentMails:
        mailsInsideFolder[0] === undefined
          ? []
          : mailsInsideFolder[0].mailDetails,
      currentSelectedFolder: folderId,
      displayMail: [],
    }); //setting current mails to show under current folder
  };

  handleCreateNewFolderClick = (folderName) => {
    //creatinh new folder
    let folderId = Date.now(); //giving unique id to each new folder created
    let copyofFolderData = this.state.folderData;
    copyofFolderData.push({ id: folderId, folderName: folderName }); //pushing new folder information to folder data state
    this.setState({ folderData: [...copyofFolderData] });
  };

  //All the folder actions ends here

  //All mail lists non component action starts here

  handleAllMaillistOptionClick = () => {
    this.setState({ mailListOption: "All" });
    let tempData = this.state.mailData.filter(
      (element) => element.folderId === this.state.currentSelectedFolder
    )[0].mailDetails;
    this.setState({ currentMails: tempData }); //select all the mails inside current folder
  };

  handleUnreadMaillistOptionClick = () => {
    this.setState({ mailListOption: "Unread" });
    let tempData = this.state.mailData
      .filter((data) => data.folderId === this.state.currentSelectedFolder)[0]
      .mailDetails.filter((data) => data.unread === true); //select only unread mails inside current folder
    this.setState({ currentMails: tempData });
  };

  handleRemoveSelectedFilterClick = () => {
    this.setState({ currentFilter: "" });
    this.setState({
      currentMails: this.state.mailData.filter(
        (data) => data.folderId === this.state.currentSelectedFolder
      )[0].mailDetails,
      mailListOption: "All", //remove selected filter currently only flagged mails
    });
  };

  handleFilterMailListOptionClick = () => {
    this.setState({
      filterMailListOptionsShow: !this.state.filterMailListOptionsShow,
    }); //hode/show filter drop down
  };

  handleApplyFilterByFlaggedClick = () => {
    this.setState({
      filterMailListOptionsShow: !this.state.filterMailListOptionsShow,
    });
    this.setState({
      currentMails: this.state.mailData
        .filter((data) => data.folderId === this.state.currentSelectedFolder)[0]
        .mailDetails.filter((data) => data.flag === true),
      currentFilter: "By Flagged", //apply filter by choosing filter from filter filter lists currently only flagged mails
    });
  };

  //All mail litsts non component action ends here

  //All mail litsts component action starts here

  handleUnreadMailClick = (mailId) => {
    //change unread to true of a mail
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
    // delete the mail from the current folder to and put under deleted mail folder
    if (this.state.currentSelectedFolder === 3) {
      //delete forever if already in delete folder
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
    //flagging a mail
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
    //handle mail click show mail and read
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
    //changing mail folder
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
    //function takes arguments and adds the mail to destinaton folder
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
    //functions removes certain mail from source folder
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
    //function to update mail property value
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
      composeMailShow,
    } = this.state;
    if (error) {
      return <div>Something went wrong please refresh the page</div>;
    } else {
      return (
        <div className="App">
          {composeMailShow && (
            <ComposeMail
              sendMail={this.handleSendMail}
              saveDraft={this.handleSaveDraft}
              cancelComposeMailClick={this.handleCancelComposeMail}
            />
          )}
          <NavBar />
          <ActionBar
            markAllReadClicked={this.handleMarkAllReadClick}
            newMailClicked={this.handleNewMailClick}
          />
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
                <div className="loading">
                  <i class="fa fa-spinner" aria-hidden="true"></i> Loading...
                </div>
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
                <div className="loading">
                  <i class="fa fa-spinner" aria-hidden="true"></i> Loading...
                </div>
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
