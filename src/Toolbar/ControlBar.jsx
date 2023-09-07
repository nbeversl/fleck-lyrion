import { PlayerControls } from "./PlayerControls";
import NowPlaying from "./NowPlaying";
import { Toolbar, Segment } from "react-onsenui";
import * as React from "react";
import SearchBar from "./SearchBar";
import { Range } from "react-onsenui";
class ControlBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playerStatus: null,
      height: 0,
    };
  }
  componentDidMount() {
    this._ismounted = true;
    const height = this.divElement.clientHeight;
    this.setState({ height });
    this.getPlayerStatus();
  }
  componentWillUnmount() {
    this._ismounted = false;
    clearTimeout(this.timer);
  }

  handleSeekChange(event) {
    var newPosition = Math.floor(
      (this.state.playerStatus.duration * event.target.value) / 100
    );
    this.props.playerInstance.seek(newPosition);
  }

  getPlayerStatus() {
    if (!this.props.targetPlayer) {
      this.timer = setTimeout(this.getPlayerStatus.bind(this), 5000);
      return;
    }
    this.props.playerInstance.getPlayerStatus((status) => {
      if (!this._ismounted) {
        return;
      }
      this.setState({ playerStatus: status }, () => {
        this.timer = setTimeout(this.getPlayerStatus.bind(this), 5000);
      });
    });
  }

  render() {
    return (
      <Toolbar>
        <div
          ref={(divElement) => {
            this.divElement = divElement;
          }}
          className="control-bar"
        >
          <div className={"control-content"}>
            <NowPlaying
              handleSeekChange={this.handleSeekChange.bind(this)}
              playerStatus={this.state.playerStatus}
              library={this.props.library}
              checkPlayerInstance={this.props.checkPlayerInstance}
              playerInstance={this.props.playerInstance}
              LMS={this.props.LMS}
            />
            <PlayerControls
              selectOpen={this.props.selectOpen}
              closeSelect={this.props.closeSelect}
              togglePlayerSelect={this.props.togglePlayerSelect}
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
            />
            {this.props.genreSelected ? (
              <div className="layout-and-search">
                <div className="grid-controls">
                  <Segment index={1}>
                    <button
                      className="order-select"
                      onClick={() => this.props.setOrderType("shuffle")}
                    >
                      Shuffle
                    </button>
                    <button
                      className="order-select"
                      onClick={() => this.props.setOrderType("alpha")}
                    >
                      Alpha
                    </button>
                    {/* <button
                      className="order-select"
                      onClick={() => this.props.setOrderType("shelf")}
                    >
                      Shelf
                    </button> */}
                  </Segment>
                </div>
              </div>
            ) : null}
            <SearchBar
              searchString={this.props.searchString}
              setSearchString={this.props.setSearchString}
              searchFor={this.props.searchFor}
            />
            <div className={"grid-size"}>
              <Range
                value={(10 - this.props.columns) * 10}
                onChange={(event) =>
                  this.props.setColumns(parseInt(event.target.value / 10))
                }
              />
              <label>Grid Size</label>
            </div>
          </div>
        </div>
      </Toolbar>
    );
  }
}

class ViewSelector extends React.Component {
  render() {
    return (
      <div className="view-and-search-selector">
        <Segment index={0}>
          <button
            className="view-selector grid"
            onClick={() => this.props.handleViewChange("grid")}
          >
            Grid
          </button>
          <button
            className="view-selector composer-artist"
            onClick={() => this.props.handleViewChange("composer-list")}
          >
            Composer/Artist
          </button>
        </Segment>
      </div>
    );
  }
}

export { ControlBar };
