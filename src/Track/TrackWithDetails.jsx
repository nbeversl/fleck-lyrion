import * as React from "react";
import { ToolbarButton } from "react-onsenui";
import "../style.css";
import TrackDetails from "./TrackDetails.tsx";
import secondsToMinutes from "../helpers.js";
import Play from '../svg/Play';
import Download from '../svg/Download';

class TrackWithDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      trackInfo: null,
      showTrackInfo: false,
    };
  }

  download() {
    if (!this.state.trackInfo) {
      this.props.library.getTrackInfo(this.props.track.id, (r) => {
        this.setState({ trackInfo: r });
        window.open(this.props.LMS.getTrack(this.state.trackInfo[0].id.toString()));
      });
    }

  }

  toggleTrackInfo() {
    if (!this.state.trackInfo) {
      this.props.library.getTrackInfo(this.props.track.id, (r) => {
        this.setState({ trackInfo: r });
      });
    }
    this.setState({ showTrackInfo: !this.state.showTrackInfo });
  }

  render() {
    return (
      <div className="track-info">
        <div className="title-and-codec">
          <span className="track-title">
            {this.props.track.tracknum}: {this.props.track.title}
          </span>
          <span className="duration">
            ({secondsToMinutes(this.props.track.duration)})
          </span>
          <span className="codec">
            {this.props.track.type === "flc" ? "FLAC" : this.props.track.type}
          </span>
        </div>
        <div className="track-info-controls">
          <ToolbarButton
            onClick={() => {
              this.props.playTrack(this.props.disc, this.props.track.serverID);
            }}
          >
            <Play className={"btn-icon"} />
          </ToolbarButton>
          <ToolbarButton onClick={this.toggleTrackInfo.bind(this)}>
            <div className="info-i">
              <div className="i">i</div>
            </div>
          </ToolbarButton>
          <ToolbarButton
              className="ion-home color-primary item"
              onClick={this.download.bind(this)}
            >
            <Download className="btn-icon download" />
          </ToolbarButton>
          
        </div>
        {this.state.trackInfo && this.state.showTrackInfo ? (
          <div>
            <TrackDetails
              trackInfo={this.state.trackInfo}
              disc={this.props.disc}
              track={this.props.track.tracknum}
            />
          </div>
        ) : (
          <div></div>
        )}
      </div>
    );
  }
}

export default TrackWithDetails;
