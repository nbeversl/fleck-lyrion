import * as React from "react";
import TrackWithSourceAlbum from "../Track/TrackWithSourceAlbum";
import AlbumGrid from "./AlbumGrid";
import { ProgressCircular } from "react-onsenui";

class SearchResults extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      artistResults: [],
    };
  }

  render() {
    return (
      <div>
        {this.props.searchResultsAlbums ? (
          <AlbumGrid
            albumList={this.props.searchResultsAlbums}
            library={this.props.library}
            LMS={this.props.LMS}
            orderType={"alpha"}
            checkPlayerInstance={this.props.checkPlayerInstance}
            playerInstance={this.props.playerInstance}
            columns={this.props.columns}
            setColumns={this.props.setColumns}
            theme={this.props.theme}
          />
        ) : (
          <ProgressCircular />
        )}
        {this.props.searchResultsTracks ? (
          <div>
            {this.props.searchResultsTracks.length ? (
              <div>
                <TrackWithSourceAlbum
                  tracks={this.props.searchResultsTracks}
                  checkPlayerInstance={this.props.checkPlayerInstance}
                  library={this.props.library}
                  LMS={this.props.LMS}
                  playerInstance={this.props.playerInstance}
                  theme={this.props.theme}
                />
              </div>
            ) : (
              <div>No Tracks Found</div>
            )}
          </div>
        ) : (
          <ProgressCircular />
        )}
      </div>
    );
  }
}

export default SearchResults;
