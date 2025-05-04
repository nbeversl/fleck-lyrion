import { render } from "react-dom";
import * as React from "react";
import { Player } from "./LMS/Player";
import { LMS } from "./LMS/server";
import { LMSLibrary } from "./LMS/Library";
import { BrowserPlayer } from "./BrowserPlayer";
import { ProgressCircular } from "react-onsenui";
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
      pingingPlayers: null,
      columns: 5,
      searchString: "",
      theme: "light-theme",
      playerInstance: null,
    };
  }

  componentDidMount() {
    var viewWidth = window.innerWidth;
    if (viewWidth < 500) {
      this.setState({ columns: 2 });
    } else {
      this.setState({ columns: 5 });
    }

    this.setState({ LMS: new LMS() }, () => {
      var l = new LMSLibrary(this.state.LMS);
      l.establishLibrary((library) => {
        this.setState({ library: library }, () => {
          this.loadRandomAlbums();
        });
      });
      this.getAvailablePlayers();
    });
    const themeSetting = /theme=[^;]+/;
    let cookie = document.cookie;
    let theme = cookie.match(themeSetting);
    if (theme) {
      theme = theme[0].replace("theme=", "");
      this.setState({ theme: theme });
    }
  }

  closeSelect() {
    var pingingPlayers = this.state.pingingPlayers;
    clearInterval(pingingPlayers);
    this.setState({
      selectOpen: false,
      pingingPlayers: null,
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
    if (playerName !== "Browser (this device)") {
      newPlayer = new Player(this.state.LMS, playerName);

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
      this.setState({
        targetPlayer: "Browser",
        playerInstance: new BrowserPlayer(this.state.LMS),
        selectOpen: false,
      });
    }
    this.closeSelect();
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
      this.setState({
        searchResultsAlbums: randomAlbums,
        view: "search",
      });
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

    this.state.library.searchTracks(item, (result) => {
      this.setState({ searchResultsTracks: result });
    });
  }

  setColumns(columns) {
    if (10 > columns > 0) {
      this.setState({ columns: 10 - columns });
    }
  }

  revealToolbar() {
    this.setState({ toolbarShowing: true });
  }
  setSearchString(searchString) {
    this.setState({ searchString: searchString });
  }

  setTheme(newTheme) {
    this.setState({ theme: newTheme });
    var element = document.getElementsByTagName("body")[0];
    element.classList.add(newTheme);
    switch (newTheme) {
      case "light-theme":
        element.classList.remove("dark-theme");
        break;
      case "dark-theme":
        element.classList.remove("light-theme");
        break;
      default:
        break;
    }
    var expiration_date = new Date();
    expiration_date.setFullYear(expiration_date.getFullYear() + 1);
    document.cookie =
      "theme=" + newTheme + "; expires=" + expiration_date.toUTCString();
  }

  render() {
    return (
      <div className={`main ${this.state.theme}`}>
        {this.state.library ? (
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
                setSearchString={this.setSearchString.bind(this)}
                searchString={this.state.searchString}
                setOrderType={this.setOrderType.bind(this)}
                orderType={this.state.orderType}
                columns={this.state.columns}
                setColumns={this.setColumns.bind(this)}
                setTheme={this.setTheme.bind(this)}
                theme={this.state.theme}
                hideToolbar={() => {
                    if (this.state.toolbarShowing) {
                      this.setState({ toolbarShowing: false });
                    }
                  }}
              />
            ) : null}

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
                  columns={this.state.columns}
                  theme={this.state.theme}
                  setColumns={this.setColumns.bind(this)}
                  toolbarShowing={this.state.toolbarShowing}
                  hideToolbar={() => {
                    if (this.state.toolbarShowing) {
                      this.setState({ toolbarShowing: false });
                    }
                  }}
                  revealToolbar={this.revealToolbar.bind(this)}
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
