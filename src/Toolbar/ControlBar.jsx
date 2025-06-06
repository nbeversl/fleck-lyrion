import { PlayerControls } from "./PlayerControls";
import NowPlaying from "./NowPlaying.tsx";
import { Toolbar, ToolbarButton, Segment } from "react-onsenui";
import { GenreMenu } from "./GenreMenu";
import * as React from "react";
import SearchBar from "./SearchBar";
import { Range } from "react-onsenui";
import CloseIcon from "../svg/CloseIcon";

class ControlBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playerStatus: null,
      trackPosition: 1,
    };
  }
  componentDidMount() {
    this._ismounted = true;
    this.getPlayerStatus();
  }

  componentWillUnmount() {
    this._ismounted = false;
    clearTimeout(this.timer);
  }

  handleSeekChange(event) {
    const newTrackPercent = event.target.value
    const newTrackTime = this.state.playerStatus.duration * (event.target.value / 100);
    this.props.playerInstance.seek(newTrackTime);
    this.setState({trackPosition : newTrackPercent})
  }

  async getPlayerStatus() {
    if (! this.props.targetPlayer) {
      this.timer = setTimeout(this.getPlayerStatus.bind(this), 1000);
      return;
    }
    const status = await this.props.playerInstance.getPlayerStatus()
    if (!this._ismounted) {
      return;
    }
    var newPosition = Math.floor((status.time / status.duration) * 100);
    this.setState({ 
      playerStatus: status,
      trackPosition: newPosition,
      }, () => {
      this.timer = setTimeout(this.getPlayerStatus.bind(this), 1000);
    });
  }

  render() {
    return (
      <Toolbar>
        <div className={`control-bar ${this.props.theme}`}>
          <div className={"control-bar-content"}>
            <NowPlaying
              handleSeekChange={this.handleSeekChange.bind(this)}
              playerStatus={this.state.playerStatus}
              library={this.props.library}
              offerPlayerSelect={this.props.offerPlayerSelect}
              playerInstance={this.props.playerInstance}
              play={this.props.play}
              genreSelected={this.props.genreSelected}
              theme={this.props.theme}
              trackPosition={this.state.trackPosition}
            />
            <PlayerControls
              playerSelectOpen={this.props.playerSelectOpen}
              closePlayerSelect={this.props.closePlayerSelect}
              openPlayerSelect={this.props.openPlayerSelect}
              targetPlayer={this.props.targetPlayer}
              switchPlayer={this.props.switchPlayer}
              getPlayerStatus={this.getPlayerStatus.bind(this)}
              playerInstance={this.props.playerInstance}
              playerStatus={this.state.playerStatus}
              players={this.props.players}
              library={this.props.library}
              handleGenreChange={this.props.handleGenreChange}
              genreSelected={this.props.genreSelected}
              controlBarHeight={this.state.height}
              theme={this.props.theme}
            />
            <div className="global-controls">
                {this.props.library && this.props.library.genres && 
                  <GenreMenu
                    genres={this.props.library.genres}
                    library={this.props.library}
                    toggleGenreSelect={this.props.toggleGenreSelect}
                    genreSelectOpen={this.props.genreSelectOpen}
                    screenWidth={this.state.screenWidth}
                    handleGenreChange={this.props.handleGenreChange.bind(this)}
                    genreSelected={this.props.genreSelected}
                    controlBarHeight={this.props.controlBarHeight}
                    theme={this.props.theme}
                  /> }

                <SearchBar
                  className="search"
                  searchString={this.props.searchString}
                  setSearchString={this.props.setSearchString}
                  searchFor={this.props.searchFor}
                />
                <div className="segments">
                <Segment className="theme-control" 
                index={this.props.theme === "dark-theme" ? 0 : 1}>
                  <button
                    className="theme-select"
                    onClick={() => this.props.setTheme("dark-theme")}
                  >
                    Dark
                  </button>
                  <button
                    className="theme-select"
                    onClick={() => this.props.setTheme("light-theme")}
                  >
                    Light
                  </button>
                </Segment>
            
                {this.props.genreSelected &&
                  <div className="alpha-shuffle">
                    <Segment index={this.props.orderType == "alpha" ? 0 : 1}>
                      <button
                        className="order-select"
                        onClick={() => this.props.setOrderType("alpha")}>
                        Alpha
                      </button>
                      <button
                        className="order-select"
                        onClick={() => this.props.setOrderType("shuffle")}>
                        Shuffle
                      </button>
                    </Segment>
                  </div>
                }
              </div>
              <div className={"grid-size"}>
                <Range
                  value={(10 - this.props.columns) * 10}
                  onChange={(event) => {
                    event.stopPropagation();
                    this.props.setColumns(10 - (parseInt(event.target.value / 10)));
                    this.props.trackGridChange()
                  }}
                />
                <label>Grid Size</label>
              </div>
              <ToolbarButton className="hide-control-bar-button" 
                  onClick={this.props.hideToolbar} >
                  <CloseIcon className={"btn-icon"} />
              </ToolbarButton>
            </div>
          </div>
        </div>          
      </Toolbar>
    );
  }
}
export { ControlBar };
