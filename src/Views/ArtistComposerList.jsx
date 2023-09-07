import * as React from "react";
import ArtistComposer from "./ArtistComposer";

class ArtistComposerList extends React.Component {
  render() {
    let artistList = {};
    this.props.albumList.forEach((item) => {
      if (!Object.keys(artistList).includes(item.artist)) {
        artistList[item.artist] = [];
      }
      artistList[item.artist].push(item);
    });
    var artists = Object.keys(artistList).sort();
    var Table = [];

    artists.forEach((artistName) => {
      Table.push(
        <ArtistComposer
          key={artistName}
          composerName={artistName}
          library={this.props.library}
          albumList={artistList[artistName]}
          genre={this.props.genreSelected}
          checkPlayerInstance={this.props.checkPlayerInstance}
          LMS={this.props.LMS}
          handleOrderChange={this.props.handleOrderChange}
          theme={this.props.theme}
        />
      );
    });

    return <div>{Table}</div>;
  }
}

export default ArtistComposerList;
