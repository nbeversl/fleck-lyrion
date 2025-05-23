import * as React from "react";
import TrackListScrolling from "./TrackListScrolling";
import { ProgressCircular, ToolbarButton, Button, Dialog } from "react-onsenui";
import Disc from '../svg/Disc';
import CloseIcon from "../svg/CloseIcon";

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
    } else this.setState({ album: this.props.album });
  }

  componentDidUpdate() {
    if (this.props.getFromId) {
      if (this.state.album && this.state.album.id == this.props.getFromId) {
        return;
      }
      this.props.library.getAlbumFromID(this.props.getFromId, (album) => {
        this.setState({album: album });
      });
    }

    if (this.props.album) {
      if (!this.state.album) {
        this.setState({album: this.props.album});
        if (this.state.modalOpen && ! this.state.discs) {
          this.getMyTracks()
        }
        return;
      }
      if (this.props.album.id != this.state.album.id) {
        this.setState({album: this.props.album });
      }
    }
  }

  getMyTracks() {
    this.props.library.getAlbumTracks(this.state.album.id, (tracks) => {
      var discs = {};
      tracks.forEach((track) => {
        var disc = track.disc;
        if (!disc) disc = "1"
        if (!Object.keys(discs).includes(disc)) discs[disc] = [];
        discs[disc].push(track);
      });
      this.setState({
        discs: discs,
        modalOpen: true });
    });
  }

  handlePlay(disc, trackNumber) {
    if (!this.props.playerInstance) {
      this.setState({modalOpen : false })
      this.props.checkPlayerInstance((playerInstance) => {
        if (playerInstance) this.props.play(disc, trackNumber);
      });
    } else this.props.play(disc, trackNumber)
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
    };
    return (
      <div className="album">
        {this.state.album ? (
          <>
            <Button modifier="large--cta" onClick={this.handleOpen.bind(this)}>
              { this.state.album.albumArtURL == false ? (
                <div className="album-no-artwork">
                  <Disc />
                  <div className="album-text-info">
                    <div className="album-title-text">
                      {this.state.album.album}
                    </div>
                    <div className="album-artist-text">
                      {this.state.album.artist}
                    </div>
                  </div>
                </div>
              ) : ( 
                <img
                  className="album-image"
                  src={this.state.album.albumArtURL}
                  loading="lazy"
                />
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
                      playerInstance={this.props.playerInstance}
                      discs={this.state.discs}
                      album={this.state.album}
                      addToPlaylist={
                        this.props.playerInstance
                          ? this.props.playerInstance.addTrack
                          : null
                      }
                      handlePlay={this.handlePlay.bind(this)}
                      checkPlayerInstance={this.props.checkPlayerInstance}
                      library={this.props.library}
                      cover={this.state.album.albumArtURL}
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
                <ToolbarButton className="hide-album-modal-button" 
                  onClick={this.handleClose.bind(this)} >
                  <CloseIcon className={"btn-icon"} />
                </ToolbarButton>
              </Dialog>
            ) : null}
          </>
        ) : null}
      </div>
    );
  }
}
export { Album };
