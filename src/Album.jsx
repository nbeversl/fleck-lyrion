import * as React from "react";
import TrackListScrolling from "./Track/TrackListScrolling";
import { ProgressCircular, Button, Dialog } from "react-onsenui";

class Album extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      discs: null,
      modalOpen: false,
      album: null,
      height: 0,
    };
  }
  componentDidMount() {
    if (this.props.getFromId) {
      this.props.library.getAlbumFromID(this.props.getFromId, (album) => {
        this.setState({
          album: album,
        });
      });
    } else {
      this.setState({
        album: this.props.album,
      });
    }
  }

  componentDidUpdate() {
    if (this.props.getFromId) {
      if (this.state.album && this.state.album.id == this.props.getFromId) {
        return;
      }
      this.props.library.getAlbumFromID(this.props.getFromId, (album) => {
        this.setState({
          album: album,
        });
      });
    }

    if (this.props.album) {
      if (!this.state.album) {
        this.setState({
          album: this.props.album,
        });
        return;
      }
      if (this.props.album.id != this.state.album.id) {
        this.setState({
          album: this.props.album,
        });
      }
    }
  }

  getMyTracks() {
    this.props.library.getAlbumTracks(this.state.album.id, (result) => {
      var discs = {};
      result.forEach((track) => {
        var disc = track.disc;
        if (!disc) {
          disc = "1";
        }
        if (!Object.keys(discs).includes(disc)) {
          discs[disc] = [];
        }
        discs[disc].push(track);
      });
      this.setState({
        discs: discs,
      });

      this.setState({ modalOpen: true });
    });
  }

  handleOpen(e) {
    e.stopPropagation();
    this.getMyTracks(this.props.library);
    this.setState({ modalOpen: true });
  }

  handleClose() {
    this.setState({ modalOpen: false });
  }

  render() {
    var backgroundImageStyle = {
      WebkitFilter: "blur(10px) saturate(2) opacity(.3)",
      filter: "blur(10px) saturate(2) opacity(.3)",
      backgroundImage: this.state.album
        ? "url('/music/" + this.state.album.artwork_track_id + "/cover.jpg')"
        : "",
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
    };

    var handleStyle = {
      width: this.props.albumWidth / 5,
      height: this.props.albumWidth / 5,
    };

    return (
      <div className="album">
        {this.state.album ? (
          <>
            <Button modifier="large--cta" onClick={this.handleOpen.bind(this)}>
              {this.props.moveable ? (
                <div className="handle-container">
                  <div style={handleStyle} className="handle"></div>
                </div>
              ) : null}
              {this.state.album.artwork_track_id === undefined ? (
                <div className="album-text-info">
                  <div className="album-title-text">
                    {this.state.album.album}
                  </div>
                  <div className="album-artist-text">
                    {this.state.album.artist}
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    backgroundImage: `url("${this.props.LMS.albumArtwork(
                    this.state.album.artwork_track_id)}")`
                  }}
                  className="album-image"
                >
                </div>
              )}
            </Button>
            {this.state.modalOpen ? (
              <Dialog
                className={"album-modal " + this.props.theme}
                isOpen={true}
                animation={"none"}
                onCancel={this.handleClose.bind(this)}
                isCancelable={true}
              >
                {this.state.discs ? (
                  <div className="tracklist">
                    <TrackListScrolling
                      moveable={this.props.moveable}
                      moveToTop={this.props.moveToTop}
                      playerInstance={this.props.playerInstance}
                      discs={this.state.discs}
                      album={this.state.album}
                      addToPlaylist={
                        this.props.playerInstance
                          ? this.props.playerInstance.addTrack
                          : null
                      }
                      checkPlayerInstance={this.props.checkPlayerInstance}
                      library={this.props.library}
                      cover={this.props.LMS.albumArtwork(
                        this.state.album.artwork_track_id
                      )}
                      LMS={this.props.LMS}
                    />
                    <div
                      className={"album-background-image"}
                      style={backgroundImageStyle}
                    />
                  </div>
                ) : (
                  <div className="album-loading">
                    <ProgressCircular />
                  </div>
                )}
              </Dialog>
            ) : null}
          </>
        ) : null}
      </div>
    );
  }
}
export { Album };
