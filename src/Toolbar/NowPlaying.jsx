import * as React from "react";
import "../style.css";
import { Album } from "../Album";
import ExtendedMetadata from "../Metadata/ExtendedMetadata";
import { Range, ProgressCircular } from "react-onsenui";

class NowPlaying extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      xid: null,
      trackInfo: null,
      album: null,
    };
  }
  componentDidMount() {
    this.getAlbumInfo();
  }
  componentDidUpdate() {
    this.getAlbumInfo();
  }

  getTrackInfo() {
    if (
      this.props.playerStatus &&
      this.props.playerStatus.playlist_cur_index != undefined &&
      this.props.playerStatus.playlist_loop[
        parseInt(this.props.playerStatus.playlist_cur_index)
      ] != undefined &&
      this.props.playerStatus.playlist_loop.length == 1
    ) 
    this.props.library.getTrackInfo(
      this.props.playerStatus.playlist_loop[
        parseInt(this.props.playerStatus.playlist_cur_index)
      ].id,
      (r) => {
        console.log(r)
        if (this.state.trackInfo != r) {
          this.setState({ trackInfo: r });
        }   
      }
    );
  }

  getAlbumInfo() {
    if (
      this.props.playerStatus &&
      this.props.playerStatus.playlist_cur_index != undefined &&
      this.props.playerStatus.playlist_loop[
        parseInt(this.props.playerStatus.playlist_cur_index)
      ] != undefined
    ) {
      this.props.library.getAlbumFromID(
        this.props.playerStatus.playlist_loop[
          parseInt(this.props.playerStatus.playlist_cur_index)
        ].album_id,
        (album) => {
          if (!this.state.album || album.id != this.state.album.id) {
            this.setState({
              album: album,
            });
          }
        }
      );
    }
  }

  render() {
    return (
      <div className="now-playing-container">
        {this.props.playerStatus &&
        this.props.playerStatus.playlist_loop &&
        this.props.playerStatus.playlist_cur_index != undefined && // can be 0
        this.props.playerStatus.playlist_loop[
          parseInt(this.props.playerStatus.playlist_cur_index)
        ] ? (
          <div className={"now-playing"}>
          { this.props.playerInstance && this.props.playerInstance.isLoading ? 
                <ProgressCircular indeterminate /> : null
            }
            <div className="now-playing-album-cover">
              <Album
                album={this.state.album}
                modal={true}
                theme={this.props.theme}
                library={this.props.library}
                checkPlayerInstance={this.props.checkPlayerInstance}
                LMS={this.props.LMS}
              />
            </div>
            <div className="now-playing-meta">
              <div className="now-playing-artist">
                {
                  this.props.playerStatus.playlist_loop[
                    parseInt(this.props.playerStatus.playlist_cur_index)
                  ].artist
                }
              </div>
              <div className="now-playing-album-title">
                {
                  this.props.playerStatus.playlist_loop[
                    parseInt(this.props.playerStatus.playlist_cur_index)
                  ].album
                }
              </div>
              {this.props.playerStatus.playlist_loop[
                parseInt(this.props.playerStatus.playlist_cur_index)
              ].disc ? (
                <div className="now-playing-disc-number">
                  {" "}
                  Disc{" "}
                  {
                    this.props.playerStatus.playlist_loop[
                      parseInt(this.props.playerStatus.playlist_cur_index)
                    ].disc
                  }{" "}
                </div>
              ) : null}
              <div className="now-playing-track-name">
                {
                  this.props.playerStatus.playlist_loop[
                    parseInt(this.props.playerStatus.playlist_cur_index)
                  ].tracknum
                }
                .
                {
                  this.props.playerStatus.playlist_loop[
                    parseInt(this.props.playerStatus.playlist_cur_index)
                  ].title
                }
              </div>

              {this.state.xid ? (
                <ExtendedMetadata
                  meta={
                    this.state.xid.discs[0][
                      this.props.playerStatus.playlist_cur_index
                    ]
                  }
                />
              ) : null}
              <Range
                className="track-time"
                value={
                  Math.floor(
                    (this.props.playerStatus.time /
                      this.props.playerStatus.duration) *
                      100
                  ) - 1
                }
                onChange={this.props.handleSeekChange}
              />
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

export default NowPlaying;
