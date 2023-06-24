import { render } from "react-dom";
import * as React from "react";
import { Player } from "./LMS/Player";
import { LMS } from "./LMS/server";
import { LMSLibrary } from "./LMS/Library";
import { Yamaha } from "./Yamaha/Yamaha";
import { BrowserPlayer } from "./BrowserPlayer";
import { Button, ProgressCircular } from "react-onsenui";
import { LibraryView } from "./LibraryView";
import { ControlBar } from "./Toolbar/ControlBar";
import "./style.css";
import "./OnsenCSS/onsenui-core.min.css";
import "./OnsenCSS/onsen-css-components.min.css";

class MediaApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      targetPlayer: 0,
      elapsedTime: 0,
      library: null,
      players_loop: [],
      showNowPlaying: false,
      selectOpen: false,
      genreSelected: null,
      view: "grid",
      searchResultsAlbums: null,
      toolbarShowing: true,
      searchResultsTracks: null,
      LMS: null,
      storage: null,
      storedLayout: null,
      orderType: "alpha",
      BrowserPlayer: null,
      pingingPlayers: null,
    };
  }

  componentDidMount() {
    this.setState({ LMS: new LMS() }, () => {
      var l = new LMSLibrary(this.state.LMS);
      l.establishLibrary((library) => {
        this.setState({ library: library }, () => {
          this.loadRandomAlbums();
        });
      });
      this.getAvailablePlayers();
    });
  }

  initBrowserPlayer() {
    var newPlayer = new BrowserPlayer(this.state.LMS);
    this.setState({
      BrowserPlayer: newPlayer,
      targetPlayer: "Browser",
      playerInstance: newPlayer,
      selectOpen: false,
    });
  }

  closeSelect() {
    var pingingPlayers = this.state.pingingPlayers;
    clearInterval(pingingPlayers);
    this.setState({
      selectOpen: false,
      pingingPlayers: pingingPlayers,
    });
  }

  openSelect() {
    this.setState({ selectOpen: true });
    var pingingPlayers = setInterval(this.getAvailablePlayers.bind(this), 3000);
    this.setState({
      pingingPlayers: pingingPlayers,
      selectOpen: true,
    });
  }

  togglePlayerSelect() {
    this.state.selectOpen ? this.closeSelect() : this.openSelect();
  }

  setOrderType(type) {
    var moveable = false;
    if (type == "shelf") {
      moveable = true;
    }
    this.setState({
      orderType: type,
    });
  }

  getAvailablePlayers() {
    this.state.LMS.request(["", ["serverstatus", "0", "20"]], (response) => {
      var availablePlayers = [];
      response.result.players_loop.forEach((player) => {
        if (player.connected == 1) {
          availablePlayers.push(player);
        }
      });
      this.setState({ players_loop: availablePlayers });
    });
  }

  switchPlayer(playerName, callback) {
    var newPlayer;

    if (playerName !== "Browser") {
      newPlayer = new Player(this.state.LMS, playerName);

      if (newPlayer.address == "Den") {
        var yamaha = new Yamaha("http://10.0.0.68");
        yamaha.powerOn();
        setTimeout(yamaha.setMediaCenter, 3000);
      }

      this.setState(
        {
          targetPlayer: playerName,
          playerInstance: newPlayer,
          selectOpen: false,
        },
        () => {
          if (callback) {
            callback();
          }
        }
      );
    } else {
      if (this.state.BrowserPlayer) {
        this.setState({
          targetPlayer: "Browser",
          playerInstance: this.state.BrowserPlayer,
        });
      } else {
        this.initBrowserPlayer();
      }
    }
  }

  checkPlayerInstance(callback) {
    if (!this.state.playerInstance) {
      this.openSelect();
      this.setState({
        toolbarShowing: true,
      });
      this.waitForPlayerInstance(callback);
    } else {
      callback(this.state.playerInstance);
    }
  }

  waitForPlayerInstance(callback) {
    setTimeout(() => {
      if (this.state.playerInstance) {
        callback(this.state.playerInstance);
      } else {
        this.waitForPlayerInstance(callback);
      }
    }, 500);
  }

  handleViewChange(name) {
    this.setState({ view: name });
  }

  toggleNowPlaying() {
    this.setState({ showNowPlaying: !this.state.showNowPlaying });
  }

  async handleGenreChange(genre) {
    var storedLayout = document.cookie || null;
    this.loadAlbumsForGenre(genre, storedLayout);
    this.setState({
      view: "grid",
    });
  }

  storeOrderChange(storedLayout) {
    document.cookie = storedLayout;
    this.setState({ storedLayout: storedLayout });
  }

  loadAlbumsForGenre(genreSelected, storedLayout) {
    this.state.library.getAllAlbumsforGenre(
      this.state.library.genres[genreSelected].id,
      () => {
        this.setState({
          genreSelected: genreSelected,
          storedLayout: storedLayout,
        });
      }
    );
  }

  loadRandomAlbums() {
    this.state.library.allAlbums((albums) => {
      var randomAlbums = [];
      for (var i = 0; i < 10; i++) {
        var selection = Math.floor(Math.random() * Object.keys(albums).length);
        randomAlbums.push(albums[selection]);
      }
      this.setState({ searchResultsAlbums: randomAlbums, view: "search" });
    });
  }

  searchFor(item) {
    this.setState({
      view: "search",
      genreSelected: null,
    });

    this.state.library.searchAlbums(item, (result) => {
      this.setState({ searchResultsAlbums: result });
    });

  checkPlayerInstance  this.state.library.searchTracks(item, (result) => {
      this.setState({ searchResultsTracks: result });
    });
  }

  revealToolbar() {
    if (!this.state.toolbarShowing) {
      this.setState({ toolbarShowing: true });
    }
  }

  render() {
    return (
      <div className="main">
        {this.state.players_loop.length > 0 && this.state.library ? (
          <div>
            {this.state.toolbarShowing ? (
              <ControlBar
                selectOpen={this.state.selectOpen}
                closeSelect={this.closeSelect.bind(this)}
                togglePlayerSelect={this.togglePlayerSelect.bind(this)}
                targetPlayer={this.state.targetPlayer}
                switchPlayer={this.switchPlayer.bind(this)}
                toggleNowPlaying={this.toggleNowPlaying.bind(this)}
                playerInstance={this.state.playerInstance}
                players={this.state.players_loop ? this.state.players_loop : []}
                library={this.state.library}
                checkPlayerInstance={this.checkPlayerInstance.bind(this)}
                handleGenreChange={this.handleGenreChange.bind(this)}
                genreSelected={this.state.genreSelected}
                LMS={this.state.LMS}
                handleViewChange={this.handleViewChange.bind(this)}
                searchFor={this.searchFor.bind(this)}
                setOrderType={this.setOrderType.bind(this)}
              />
            ) : (
              <Button
                className="show-controlbar"
                onClick={() => {
                  this.setState({ toolbarShowing: true });
                }}
              >
                {" "}
                Toolbar{" "}
              </Button>
            )}

            {this.state.library.genres ? (
              <div className="library-view">
                <LibraryView
                  view={this.state.view}
                  genreSelected={this.state.genreSelected}
                  playerInstance={this.state.playerInstance}
                  library={this.state.library}
                  searchResultsAlbums={this.state.searchResultsAlbums}
                  searchResultsTracks={this.state.searchResultsTracks}
                  checkPlayerInstance={this.checkPlayerInstance.bind(this)}
                  LMS={this.state.LMS}
                  storedLayout={this.state.storedLayout}
                  storeOrderChange={this.storeOrderChange.bind(this)}
                  orderType={this.state.orderType}
                  hideToolbar={() => {
                    if (this.state.toolbarShowing) {
                      this.setState({ toolbarShowing: false });
                    }
                  }}
                />
              </div>
            ) : null}
          </div>
        ) : (
          <div className="loading-message">
            <ProgressCircular />
          </div>
        )}
      </div>
    );
  }
}
render(<MediaApp />, document.getElementById("root"));
