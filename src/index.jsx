import { render } from "react-dom";
import * as React from "react";
import { Player } from "./LMS/Player";
import { LMS } from "./LMS/server.tsx";
import { LMSLibrary } from "./LMS/Library";
import { BrowserPlayer } from "./BrowserPlayer";
import { ProgressCircular } from "react-onsenui";
import { LibraryView } from "./LibraryView";
import { ControlBar } from "./Toolbar/ControlBar";
import "./OnsenCSS/onsenui-core.min.css";
import "./OnsenCSS/onsen-css-components.min.css";

class MediaApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      targetPlayer: null,
      library: null,
      players_loop: [],
      showNowPlaying: false,
      playerSelectOpen: false,
      genreSelected: null,
      genreSelectOpen: false,
      view: "grid",
      searchResultsAlbums: null,
      toolbarShowing: true,
      searchResultsTracks: null,
      resolvePlayerSelection: null,
      LMS: null,
      columns: 5,
      orderType: "alpha",
      pingingPlayers: null,
      searchString: "",
      theme: null,
      playerInstance: null,
      browserPlayer: null,
      lastGridChange:  Math.floor(Date.now() / 1000),
    };
  }

  componentDidMount() {
    this.establishLibrary()
    if (window.screen.width < 450) this.setState({columns: 2})
  }

  async establishLibrary() {
    const LMSInstance = new LMS()
    this.setState({ LMS: LMSInstance })
    var l = new LMSLibrary(LMSInstance);
    const library = await l.establishLibrary();
    this.setState({ library: library }, async function getPlayersAndState() {
      await this.getAvailablePlayers();
      this.getSavedState()
    })
  }

  async getSavedState() {
    const themeSetting = /theme=[^;]+/;
    let cookie = document.cookie;
    let theme = cookie.match(themeSetting);
    if (theme) theme = theme[0].replace("theme=", "");
    else theme = "dark-theme";
    this.setTheme(theme);
    const selectedGenre = localStorage.getItem("selectedGenre")
    const selectedPlayer = localStorage.getItem("selectedPlayer")
    if (selectedGenre !== 'null' && selectedGenre != null ) await this.handleGenreChange(selectedGenre)
    else await this.loadRandomAlbums();
    if (selectedPlayer) {
      const playerNames = this.state.players_loop.map( player => {
        return player.name
      })
      if (playerNames.includes(selectedPlayer)) this.switchPlayer(selectedPlayer)
    }
  }

  closePlayerSelect() {
    var pingingPlayers = this.state.pingingPlayers;
    clearInterval(pingingPlayers);
    this.setState({
      playerSelectOpen: false,
      pingingPlayers: null,
    });
  }

  getBrowserPlayer() {
    if (! this.state.browserPlayer) {
      const playerInstance = new BrowserPlayer(this.state.LMS)
      this.setState({browserPlayer: playerInstance})
      return playerInstance
    }
    return this.state.browserPlayer
  }

  setOrderType(type) {
    this.setState({orderType: type});
  }

  openPlayerSelect() {
    this.setState({ playerSelectOpen: true });
    var pingingPlayers = setInterval(this.getAvailablePlayers.bind(this), 3000);
    this.setState({
      pingingPlayers: pingingPlayers,
      playerSelectOpen: true,
    });
  }

  toggleGenreSelect() {
    this.state.genreSelectOpen ? this.closeGenreSelect() : this.openGenreSelect();
  }

  closeGenreSelect() {
    this.setState({ genreSelectOpen : false })
  }

  openGenreSelect() {
    this.setState({ genreSelectOpen : true })
  }

  play(track, startNumber) {
    this.state.playerInstance.playAlbumFromTrackAndContinue(track, startNumber);
    this.setState({ toolbarShowing: true });
  }

  async getAvailablePlayers() {
    const serverStatus = await this.state.LMS.request(["", ["serverstatus", "0", "20"]])
    var availablePlayers = [];
    serverStatus.result.players_loop.map( (player) => {
      if (player.connected == 1) availablePlayers.push(player);
    });
    this.setState({ players_loop: availablePlayers });
  }

  switchPlayer(playerName) {
    var newPlayer;
    if (playerName !== "Browser (this device)") {
      const playerInstance = new Player(this.state.LMS, playerName)
      const targetPlayer = playerName
    } else {
      const playerInstance = this.getBrowserPlayer()
      const targetPlayer = "Browser (this device)"
    }
    this.setState({
      targetPlayer: targetPlayer,
      playerInstance: playerInstance,
      playerSelectOpen: false,
      }, () => { 
        this.closePlayerSelect();
        localStorage.setItem("selectedPlayer", playerName);
        if (this.resolvePlayerSelection) {
          this.resolvePlayerSelection(this.state.playerInstance);
          this.resolvePlayerSelection = null;
        }
    });
  }

  offerPlayerSelect() {
    return new Promise( (resolve) => {
      this.resolvePlayerSelection = resolve;
      this.openPlayerSelect()
      this.setState({ toolbarShowing: true });      
    })
  }

  toggleNowPlaying() {
    this.setState({ showNowPlaying: !this.state.showNowPlaying });
  }

  async handleGenreChange(genre) {
    this.trackGridChange()
    this.loadAlbumsForGenre(genre);
    this.setState({ view: "grid" });
    localStorage.setItem("selectedGenre", genre);
  }

  async loadAlbumsForGenre(genreSelected) {
    await this.state.library.getAllAlbumsforGenre(this.state.library.genres[genreSelected].id);
    this.setState({ genreSelected: genreSelected });
  }

  async loadRandomAlbums() {
    const albums = await this.state.library.allAlbums()
    var randomAlbums = [];
    let numberChosen = 50
    let selection = Math.floor(Math.random() * Object.keys(albums).length);
    if (numberChosen > Object.keys(albums).length) numberChosen = Object.keys(albums).length - 1
    let selectionsChosen = []
    for (var i = 0; i < numberChosen; i++) {
      while(selectionsChosen.includes(selection) && selectionsChosen.length < Object.keys(albums).length) {
        selection = Math.floor(Math.random() * Object.keys(albums).length);
      }
      randomAlbums.push(albums[selection]);
      selectionsChosen.push(selection)
    }
    this.setState({
      genreSelected: null,
      searchResultsTracks: [],
      searchResultsAlbums: randomAlbums,
      view: "search",
    });
    localStorage.setItem("selectedGenre", null);
  }

  async searchFor(item) {
    this.setState({
      view: "search",
      genreSelected: null,
      searchResultsAlbums: [],
      searchResultsTracks: []
    });

   const {searchResultsTracks, searchResultsAlbums } = await this.state.library.fullSearch(item);
   this.setState({
      searchResultsTracks: searchResultsTracks,
      searchResultsAlbums: searchResultsAlbums
    });
  }

  setColumns(columns) {
    if (10 > columns > 0) this.setState({ columns: columns });
  }

  revealToolbar() {
    this.setState({ toolbarShowing: true });
  }
  setSearchString(searchString) {
    this.setState({ searchString: searchString });
  }

  trackGridChange() {
    this.setState({ lastGridChange: Math.floor(Date.now() / 1000) })
  }

  handleHideToolbar() {
    let now =  Math.floor(Date.now() / 1000)
    if ((now - this.state.lastGridChange > 1) && this.state.toolbarShowing) {
      this.setState({ toolbarShowing: false });
    }
  }

  setTheme(newTheme) {
    this.setState({ theme: newTheme });
    var element = document.getElementsByTagName("body")[0];
    element.classList.add(newTheme);
    if (newTheme == "light-theme") element.classList.remove("dark-theme");
    if (newTheme == "dark-theme") element.classList.remove("light-theme");
    var expiration_date = new Date();
    expiration_date.setFullYear(expiration_date.getFullYear() + 1);
    document.cookie = "theme=" + newTheme + "; expires=" + expiration_date.toUTCString();
  }

  render() {
    return (
      <div className={`main ${this.state.theme}`}>
        {this.state.library ? (
          <>
            {this.state.toolbarShowing &&
              <ControlBar
                loadRandomAlbums={this.loadRandomAlbums.bind(this)}
                playerSelectOpen={this.state.playerSelectOpen}
                closePlayerSelect={this.closePlayerSelect.bind(this)}
                openPlayerSelect={this.openPlayerSelect.bind(this)}
                targetPlayer={this.state.targetPlayer}
                switchPlayer={this.switchPlayer.bind(this)}
                toggleNowPlaying={this.toggleNowPlaying.bind(this)}
                playerInstance={this.state.playerInstance}
                players={this.state.players_loop ? this.state.players_loop : []}
                library={this.state.library}
                genreSelectOpen={this.state.genreSelectOpen}
                offerPlayerSelect={this.offerPlayerSelect.bind(this)}
                handleGenreChange={this.handleGenreChange.bind(this)}
                genreSelected={this.state.genreSelected}
                toggleGenreSelect={this.toggleGenreSelect.bind(this)}
                play={this.play.bind(this)}
                searchFor={this.searchFor.bind(this)}
                setSearchString={this.setSearchString.bind(this)}
                searchString={this.state.searchString}
                setOrderType={this.setOrderType.bind(this)}
                orderType={this.state.orderType}
                columns={this.state.columns}
                trackGridChange={this.trackGridChange.bind(this)}
                setColumns={this.setColumns.bind(this)}
                setTheme={this.setTheme.bind(this)}
                theme={this.state.theme}
                hideToolbar={this.handleHideToolbar.bind(this)}
              />
            }
            {this.state.library.genres &&
              <div className="library-view">
                <LibraryView
                  view={this.state.view}
                  genreSelected={this.state.genreSelected}
                  playerInstance={this.state.playerInstance}
                  library={this.state.library}
                  searchResultsAlbums={this.state.searchResultsAlbums}
                  searchResultsTracks={this.state.searchResultsTracks}
                  offerPlayerSelect={this.offerPlayerSelect.bind(this)}
                  loadRandomAlbums={this.loadRandomAlbums.bind(this)}
                  orderType={this.state.orderType}
                  columns={this.state.columns}
                  theme={this.state.theme}
                  play={this.play.bind(this)}
                  setColumns={this.setColumns.bind(this)}
                  toolbarShowing={this.state.toolbarShowing}
                  hideToolbar={this.handleHideToolbar.bind(this)}
                  revealToolbar={this.revealToolbar.bind(this)}
                />
              </div>
            }  
          </>
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
