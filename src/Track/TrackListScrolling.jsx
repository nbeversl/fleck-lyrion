import * as React from "react";
import { Scrollbars } from "react-custom-scrollbars";
import TrackWithDetails from "./TrackWithDetails";
import { ToolbarButton, Button, ProgressCircular, Modal } from "react-onsenui";

class TrackListScrolling extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      albumArtModalOpen: false,
    };
  }

  playTrack(disc, trackNumber) {
    this.props.checkPlayerInstance((playerInstance) => {
      if (playerInstance) {
        playerInstance.playAlbumFromTrackAndContinue(
          this.props.discs[disc][0], // disc doesn't matter, only passes the album ID
          trackNumber
        );
      }
    });
  }

  handleAlbumArtModal() {
    this.setState({ albumArtModalOpen: !this.state.albumArtModalOpen });
  }

  // downloadAlbum() {
  //   const numDiscs = Object.keys(this.props.discs)
  //   numDiscs.forEach(disc => {
  //     this.props.discs[disc].forEach((track) => {
  //       setTimeout( () => {
  //         window.open(this.props.LMS.getTrack(track.id.toString()));
  //       }, 1000);

  //       })
  //   });
  // }

  render() {
    const tracklistStyle = {
      width: "100%",
      position: "absolute",
      zIndex: "100",
      overflow: "hidden",
      maxWidth: "100%",
    };

    var numDiscs = Object.keys(this.props.discs);
    let List = [];
    var serverID = 0;

    /* Alows for errors or duplicates in disc/track numbering */
    var keySuffix = 0;
    var discInModal = 1;
    numDiscs.forEach((disc) => {
      if (numDiscs.length > 1) {
        keySuffix += 1;
        List.push(
          <div className={"disc-number"} key={"DISC-" + disc + keySuffix}>
            {discInModal !== 1 ? <hr></hr> : null}
            <div className="disc-number-text"> DISC {disc} </div>
          </div>
        );
      }
      this.props.discs[disc].forEach((track) => {
        var trackNumber = track.tracknum;
        track.serverID = serverID;
        keySuffix += 1;
        List.push(
          <TrackWithDetails
            key={"TRACK-" + disc + "-" + trackNumber + keySuffix}
            discs={this.props.discs}
            disc={disc}
            track={track}
            trackNumber={trackNumber}
            playTrack={this.playTrack.bind(this)}
            addToPlaylist={this.props.addToPlaylist}
            library={this.props.library}
            LMS={this.props.LMS}
          />
        );
        serverID++;
        discInModal++;
      });
    });

    return (
      <div className="tracklist-container">
        <Modal
          onClick={this.handleAlbumArtModal.bind(this)}
          isOpen={this.state.albumArtModalOpen}
        >
          <img src={this.props.cover} className="album-image-modal" />
        </Modal>
        {this.props.discs ? (
          <Scrollbars style={tracklistStyle}>
            {this.props.moveable ? (
              <ToolbarButton
                onClick={() => {
                  this.props.moveToTop(this.props.album.id);
                  this.setState({ modalOpen: false });
                }}
              >
                Move to top
              </ToolbarButton>
            ) : null}

            <div className="album-info">
              <div className="text-info">
                <div className="tracklist-artist">
                  {this.props.album.artist}
                </div>
                <div className="tracklist-album-title">
                  {this.props.album.album}
                </div>
              </div>
              <Button
                onClick={this.handleAlbumArtModal.bind(this)}
                className="mini-album-cover"
              >
                <img src={this.props.cover} />
              </Button>
            </div>
            <hr />
            <div className="grid-tracklist">{List}</div>
          </Scrollbars>
        ) : (
          <ProgressCircular />
        )}
      </div>
    );
  }
}

export default TrackListScrolling;
