import React from "react";
import { Range, ToolbarButton } from "react-onsenui";
import { PlayerSelector } from "./PlayerSelector";
import Play from '../svg/Play';
import Pause from '../svg/Pause';
import Stop from '../svg/Stop';
import Forward from '../svg/Forward';
import Backward from '../svg/Backward';
import Next from '../svg/Next';
import Previous from '../svg/Previous';

class PlayerControls extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      volume: null,
      nowPlayingShowing: false,
      isPlaying: null,
    };
  }

  componentDidMount() {
    this.setState({ isPlaying: this.props.playerInstance?.playing })
  }

  componentDidUpdate() {
    if (this.props.playerInstance && 
      (this.props.playerInstance.playing !== this.state.isPlaying)) {
      this.setState({ isPlaying: this.props.playerInstance.playing });
      }
  }

  async playOrPause() {

    if (this.props.playerInstance) {
      // for UI only; the player instance will update this if it is wrong
      this.setState({ isPlaying : ! this.state.isPlaying }) 
      await this.props.playerInstance.playOrPause();
    }
  }

  setVolume(event) {
    this.setState({ volume: parseInt(event.target.value) }, () => {
      this.props.playerInstance.setVolume(this.state.volume);
    });
  }

  handleBackButton() {
    if (this.props.playerStatus.time < 3) {
      this.props.playerInstance.previousTrack();
    } else {
      this.props.playerInstance.seek(0);
    }
  }

  render() {
    return (
      <div className="player-control-bar">
          <PlayerSelector
            togglePlayerSelect={this.props.togglePlayerSelect}
            playerSelectOpen={this.props.playerSelectOpen}
            closePlayerSelect={this.props.closePlayerSelect}
            openPlayerSelect={this.props.openPlayerSelect}
            players={this.props.players}
            selectedPlayer={this.props.targetPlayer}
            switchPlayer={this.props.switchPlayer}
            getPlayerStatus={this.props.getPlayerStatus}
            theme={this.props.theme}
          />
        <div className="player-controls">
          {this.props.playerInstance?.trackSelected &&
            <div className="base-lms-controls">
              <ToolbarButton
                className="player-control-button"
                onClick={this.playOrPause.bind(this)}
              >
                {this.state.isPlaying ?
                  <Pause className={"btn-icon"} />
                  :
                  <Play className={"btn-icon"} />
                }
              </ToolbarButton>

              <ToolbarButton onClick={this.props.playerInstance.skipBackward}>
                <Backward className={"btn-icon"} />
              </ToolbarButton>

              <ToolbarButton onClick={this.props.playerInstance.skipForward}>
                <Forward className={"btn-icon"}
                />
              </ToolbarButton>

              <ToolbarButton
                className="player-control-button"
                onClick={
                  this.props.playerInstance
                    ? this.handleBackButton.bind(this)
                    : null
                }
              >
                <Previous className={"btn-icon"} />
              </ToolbarButton>

              <ToolbarButton
                className="player-control-button"
                onClick={
                  this.props.playerInstance
                    ? this.props.playerInstance.nextTrack
                    : null 
                  }>
                <Next className={"btn-icon"} />
              </ToolbarButton>
            </div>
             }
          </div>
          {this.props.playerInstance?.trackSelected &&
            <div className={"slider-volume"}>
              { this.props.playerInstance?.trackSelected &&
                <div>
                  <Range
                    value={this.volume}
                    onChange={this.setVolume.bind(this)}
                  />
                  <label>Player Volume</label>
                </div>
              }
            </div>
          }
        </div>
    );
  }
}

export { PlayerControls };
