import React, { Component } from "react";
import "./ComposeMail.css";

export class ComposeMail extends Component {
  constructor() {
    super();
    this.state = {
      to: "",
      subject: "",
      mailContent: "",
    };
    this.emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  }
  handleOnChange = (element) => {
    this.setState({ [element.target.name]: element.target.value });
  };
  handleMailSend = () => {
    if (
      this.state.to.trim() === "" ||
      this.state.subject.trim() === "" ||
      this.state.mailContent.trim() === ""
    ) {
      alert("All the fileds are mandatory");
      return;
    }
    if (!this.emailRegex.test(this.state.to)) {
      alert("not a valid email id");
      return;
    }
    if (this.state.subject.length > 30) {
      alert("subject should be less than 30 characters");
      return;
    }
    this.props.sendMail(
      this.state.to,
      this.state.subject,
      this.state.mailContent
    );
  };

  handleDraftSave = () => {
    if (
      this.state.to.trim() === "" ||
      this.state.subject.trim() === "" ||
      this.state.mailContent.trim() === ""
    ) {
      alert("All the fileds are mandatory");
      return;
    }
    if (!this.emailRegex.test(this.state.to)) {
      alert("not a valid email id");
      return;
    }
    if (this.state.subject.length > 30) {
      alert("subject should be less than 30 characters");
      return;
    }
    this.props.saveDraft(
      this.state.to,
      this.state.subject,
      this.state.mailContent
    );
  };

  render() {
    return (
      <div class="w3-modal" style={{ display: "block" }}>
        <div class="w3-modal-content composeMailContent w3-animate-top">
          <div className="w3-row">
            <div className="w3-col" style={{ width: "8%" }}>
              <button
                className="w3-btn w3-blue w3-small"
                onClick={this.handleMailSend}
              >
                Send
              </button>
            </div>
            <div className="w3-col" style={{ width: "10%" }}>
              <button
                onClick={this.handleDraftSave}
                className="w3-btn w3-blue w3-small"
              >
                Save in Draft
              </button>
            </div>
          </div>
          <div className="elements">
            To:{" "}
            <input
              name="to"
              value={this.state.to}
              onChange={this.handleOnChange}
              className="w3-input"
            />
          </div>
          <div className="elements">
            Subject:{" "}
            <input
              name="subject"
              value={this.state.subject}
              onChange={this.handleOnChange}
              className="w3-input"
            />
          </div>
          <div className="elements">
            Mail:
            <input
              name="mailContent"
              value={this.state.mailContent}
              onChange={this.handleOnChange}
              className="w3-input"
            />
          </div>
          <div style={{ marginTop: "2%" }}>
            <button
              className="w3-btn w3-red w3-small"
              onClick={this.props.cancelComposeMailClick}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default ComposeMail;
