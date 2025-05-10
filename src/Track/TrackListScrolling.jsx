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

  handleAlbumArtModal() {
    this.setState({ albumArtModalOpen: !this.state.albumArtModalOpen });
  }

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
            handlePlay={() => this.props.handlePlay(this.props.discs[disc][0], trackNumber-1)}
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
          isOpen={this.state.albumArtModalOpen}> 
          <div style={{ 
              backgroundImage: `url("${this.props.cover}")`,
              backgroundPosition: "center",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat", }}
              className="album-image-modal"></div>
        </Modal>
        {this.props.discs ? (
          <Scrollbars style={tracklistStyle}>
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
               { this.props.cover && <img src={this.props.cover} /> }
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
