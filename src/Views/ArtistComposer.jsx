import * as React from "react";

import Card from "react-bootstrap/Card";
import AlbumGrid from "./AlbumGrid";
import { cooLog } from "../javascript-utils";

class ArtistComposer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      order: [],
      infoedAlbums: [],
    };
  }

  render() {
    var order = [];
    this.props.albumList.forEach((album) => {
      order.push(album.id);
    });
    return (
      <Card>
        {this.props.composerName}
        <AlbumGrid
          albumList={this.props.albumList}
          order={order}
          orderType={"alpha"}
          library={this.props.library}
          checkPlayerInstance={this.props.checkPlayerInstance}
          LMS={this.props.LMS}
          genre={this.props.genre}
          theme={this.props.theme}
        />
      </Card>
    );
  }
}

export default ArtistComposer;
