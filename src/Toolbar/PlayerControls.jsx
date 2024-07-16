import React from "react";
import { Yamaha } from "../Yamaha/Yamaha";
import { Range, ToolbarButton } from "react-onsenui";
import { GenreMenu } from "./GenreMenu";
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
      yamahaVolume: -0,
      nowPlayingShowing: false,
      yamaha: new Yamaha("http://10.0.0.68:80"),
    };
  }

  setVolume(event) {
    this.setState({ volume: parseInt(event.target.value) });
    this.props.playerInstance.setVolume(this.state.volume);
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
      <div className="player-bar">
        <div className="selectors">
          <PlayerSelector
            togglePlayerSelect={this.props.togglePlayerSelect}
            selectOpen={this.props.selectOpen}
            closeSelect={this.props.closeSelect}
            players={this.props.players}
            selectedPlayer={this.props.targetPlayer}
            switchPlayer={this.props.switchPlayer}
            getPlayerStatus={this.props.getPlayerStatus}
            theme={this.props.theme}
          />
          {this.props.library && this.props.library.genres ? (
            <GenreMenu
              genres={this.props.library.genres}
              library={this.props.library}
              screenWidth={this.state.screenWidth}
              handleGenreChange={this.props.handleGenreChange.bind(this)}
              genreSelected={this.props.genreSelected}
              controlBarHeight={this.props.controlBarHeight}
              theme={this.props.theme}
            />
          ) : null}
        </div>
        {this.props.playerInstance ? (
          <div className="player-controls">
            {this.props.playerInstance.address == "Den" ? (
              <div className="custom-den-controls">
                <ToolbarButton
                  className="player-control-button"
                  onClick={this.state.yamaha.volumeDown}
                >
                  <img className={"btn-icon"} src={"./html/icon/minus.png"} />
                </ToolbarButton>

                <ToolbarButton
                  className="player-control-button"
                  onClick={this.state.yamaha.volumeUp}
                >
                  <img className={"btn-icon"} src={"./html/icon/plus.png"} />
                </ToolbarButton>
              </div>
            ) : null}
            <div className="base-lms-controls">
              <ToolbarButton
                className="player-control-button"
                onClick={() => {
                  if (this.props.playerInstance) {
                    this.props.playerInstance.playOrPause();
                  }
                }}
              >
                {this.props.playerInstance.playing ? (
                  <Pause className={"btn-icon"} />
                ) : (
                  <Play className={"btn-icon"} />
                )}
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
                }
              >
                <Next className={"btn-icon"} />
              </ToolbarButton>
            </div>

            {! [null, "Browser"].includes(this.props.targetPlayer)  ? (
              <div className={"slider-volume"}>
                <Range
                  value={this.props.playerInstance.volume}
                  onChange={this.setVolume.bind(this)}
                />
                <label>LMS Player Volume</label>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    );
  }
}

export { PlayerControls };
