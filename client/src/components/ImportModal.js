import React, { Component } from "react";
import { connect } from "react-redux";
import SetlistCard from "./SetlistCard";
import * as actions from "../actions";

class ImportModal extends Component {
  state = {
    open: false,
    loading: false,
    done: this.props.false,
    success: false,
  };

  show = (dimmer) => () => this.setState({ dimmer, open: true });
  close = () => this.setState({ open: false, done: false });
  loading = () => this.setState({ loading: true });
  finished = () => this.setState({ loading: false, done: true });
  success = () => this.setState({ success: true });

  canImportSetlist = () => {
    return this.props.auth.credits > 1;
  };

  //TODO: on successful request, then deduct a credit
  importSetlist = () => {
    this.loading();

    console.log(this.props.search.nonEmptySetlists);
    console.log({
      setlists: this.props.search.nonEmptySetlists.slice(0, 2),
      artistName: this.props.searchDetails.artist.name,
      artistSpotifyId: this.props.searchDetails.artist.id,
    });
    setTimeout(() => {
      this.finished();
      this.success();
      // this.props.handleCredit();
    }, 2000);
  };

  renderSetlists = (setlist) => {
    if (!this.props.search) {
      return this.renderGeneralWarning("No search found");
    }

    if (this.props.search.error === 404) {
      return this.renderGeneralWarning("No artist found");
    }

    return setlist.map((set, index) => (
      <SetlistCard key={index} setlist={set} details={false} />
    ));
  };

  renderDoneModal = (header, message, success) => {
    const color = success ? "green" : "red";
    return (
      <>
        <div>Modal</div>
      </>
    );
  };

  renderDialogModal = () => {
    return (
      <>
        {" "}
        <p>
          Would you like to import the setlist for{" "}
          {this.props.searchDetails.artist.name}?
          {!this.canImportSetlist() && (
            <p className="warning">
              You don't have enough credits to import. Please buy more.
            </p>
          )}
          {!this.state.loading && this.canImportSetlist() && (
            <p className="success">
              You have enough credits to import this setlist.
            </p>
          )}
        </p>
        <p>
          <div>
            <h1 className="header">Most recent sets: </h1>
            <p>
              {this.renderSetlists(
                this.props.search.nonEmptySetlists.slice(0, 2)
              )}
              {this.state.loading && (
                <div className="loader-card-container">
                  <p>
                    <div className="ui active dimmer">
                      <div className="ui text loader">Loading</div>
                    </div>
                  </p>
                </div>
              )}
            </p>
          </div>
        </p>
        <p>
          <p color="black" onClick={this.close}>
            No
          </p>
          {this.canImportSetlist() && (
            <p
              positive
              icon="checkmark"
              labelPosition="right"
              content="Spend 1 Credit"
              onClick={this.importSetlist}
            />
          )}
          {!this.canImportSetlist() && (
            <p
              icon="checkmark"
              labelPosition="right"
              content="Buy more credits"
              onClick={this.close}
            />
          )}
        </p>
      </>
    );
  };

  render() {
    const { open, dimmer, done, success } = this.state;

    return (
      <div>
        {
          <>
            <p onClick={this.show(true)}>Import Setlist</p>

            <p
              dimmer={dimmer}
              open={open}
              onClose={this.close}
              centered={false}
            >
              {done &&
                success &&
                this.renderDoneModal(
                  "Finished Importing",
                  "Check your Spotify account for the playlist!",
                  true
                )}

              {done &&
                !success &&
                this.renderDoneModal(
                  "Error importing. Please try again.",
                  false
                )}

              {!done && this.renderDialogModal()}
            </p>
          </>
        }
      </div>
    );
  }
}

const mapStateToProps = ({ auth, search, searchDetails }) => {
  return { auth, search, searchDetails };
};

export default connect(mapStateToProps, actions)(ImportModal);