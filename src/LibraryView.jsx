import React from "react";
import AlbumGrid from "./Views/AlbumGrid";
import SearchResults from "./Views/SearchResults";
import { Page, ToolbarButton } from "react-onsenui";
import ControlPanelIcon from "./svg/ControlPanelIcon";
import Randomize from "./svg/Randomize";
import Play from './svg/Play';
import Pause from './svg/Pause';

class LibraryView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      view: null,
      isPlaying: null,
      lastScroll: new Date().getTime(),
    };
  }

  async playOrPause() {
    if (this.props.playerInstance) {
      // for UI only; the player instance will update this if it is wrong
      await this.props.playerInstance.playOrPause();
      this.setState({ isPlaying : ! this.state.isPlaying }) 
    }
  }

  handleScroll() {
    this.props.hideToolbar()
  }

  componentDidMount() {
    this.setState({ view: this.props.view });
    this.setState({ isPlaying: this.props.playerInstance?.playing })
  }

  componentDidUpdate() {

    if (this.props.view != this.state.view) this.setState({ view: this.props.view })
    if (this.props.playerInstance && 
      (this.props.playerInstance.playing != this.state.isPlaying)) {
      console.log("NOW SETTING STATE FROM PLAUYER TO", this.props.playerInstance.playing)
      this.setState({ isPlaying: this.props.playerInstance.playing });
      }
  }
  render() {
    return (
      <Page onScroll={this.handleScroll.bind(this)}>
        {this.state.view == "grid" && this.props.genreSelected && 
          <AlbumGrid
            albumList={this.props.library.genres[this.props.genreSelected].albums}
            hideToolbar={this.props.hideToolbar}
            play={this.props.play}
            playerInstance={this.props.playerInstance}
            library={this.props.library}
            offerPlayerSelect={this.props.offerPlayerSelect}
            orderType={this.props.orderType}
            columns={this.props.columns}
            setColumns={this.props.setColumns}
            theme={this.props.theme}
          />
          }

        {this.state.view == "search"  &&
          <SearchResults
            searchResultsAlbums={this.props.searchResultsAlbums}
            searchResultsTracks={this.props.searchResultsTracks}
            hideToolbar={this.props.hideToolbar}
            play={this.props.play}
            playerInstance={this.props.playerInstance}
            library={this.props.library}
            offerPlayerSelect={this.props.offerPlayerSelect}
            columns={this.props.columns}
            setColumns={this.props.setColumns}
            theme={this.props.theme}
          />
        }
        
        { ! this.props.toolbarShowing &&
          <div className="fixed-buttons">
            { this.props.playerInstance?.trackSelected &&
              <ToolbarButton className="player-control-button"
                  onClick={this.playOrPause.bind(this)}
                >
                  {this.state.isPlaying ?
                    <Pause className={"btn-icon"} />
                    :
                    <Play className={"btn-icon"} />
                  }
                </ToolbarButton>
            }
            <ToolbarButton
              onClick={this.props.loadRandomAlbums}>
              <Randomize className={"btn-icon randomize-icon"} />
            </ToolbarButton>
            <ToolbarButton className="show-control-bar-button"
              onClick={this.props.revealToolbar} >
              <ControlPanelIcon className={"btn-icon show-control-bar-button"} />
            </ToolbarButton>
          </div>
        }
      </Page>
    );
  }
}

export { LibraryView };
