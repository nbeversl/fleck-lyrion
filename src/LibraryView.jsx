import * as React from "react";
import AlbumGrid from "./Views/AlbumGrid";
import SearchResults from "./Views/SearchResults";
import { Page } from "react-onsenui";

class LibraryView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      view: null,
    };
  }
  handleAlbumChange(id, name) {
    this.props.playerInstance.getAlbumTracks(id, (result) => {
      this.setState({ trackList: result });
    });
    this.setState({ albumSelected: name });
    this.setState({ albumSelectedID: id });
  }

  componentDidMount() {
    this.setState({ view: this.props.view });
  }
  componentDidUpdate() {
    if (this.props.view != this.state.view) {
      this.setState({ view: this.props.view });
    }
  }
  render() {
    var view;
    switch (this.state.view) {
      case "grid":
        view = this.props.genreSelected ? (
          <AlbumGrid
            albumList={
              this.props.library.genres[this.props.genreSelected].albums
            }
            genre={this.props.genreSelected}
            clickHandler={this.handleAlbumChange}
            library={this.props.library}
            checkPlayerInstance={this.props.checkPlayerInstance}
            LMS={this.props.LMS}
            storeOrderChange={this.props.storeOrderChange}
            storedLayout={this.props.storedLayout}
            orderType={this.props.orderType}
            columns={this.props.columns}
            setColumns={this.props.setColumns}
            theme={this.props.theme}
          />
        ) : null;
        break;

      case "search":
        view = (
          <SearchResults
            screenWidth={this.props.screenWidth}
            searchResultsAlbums={this.props.searchResultsAlbums}
            searchResultsTracks={this.props.searchResultsTracks}
            library={this.props.library}
            checkPlayerInstance={this.props.checkPlayerInstance}
            LMS={this.props.LMS}
            playerInstance={this.props.playerInstance}
            columns={this.props.columns}
            setColumns={this.props.setColumns}
            theme={this.props.theme}
          />
        );
        break;
      default:
        break;
    }
    return (
      <Page
        onScroll={() => {
          this.props.hideToolbar();
        }}
      >
        {view}
      </Page>
    );
  }
}

export { LibraryView };
