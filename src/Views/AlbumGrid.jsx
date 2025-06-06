import * as React from "react";
import { Album } from "../Album/Album";
import { GestureDetector } from "react-onsenui";

class AlbumGrid extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      order: [],
      lastPinch: new Date().getTime(),
      layout: null,
      orderType: null,
      theme: null,
    };
  }

  componentDidMount() {
    this.makeLayout()
    var albumDict = makeAlbumDict(this.props.albumList);
    this.setState({
        albumDict: albumDict,
        orderType: this.props.orderType,
        columns: this.props.columns,
        theme: this.props.theme,
      },
      () => { this.reArrange(true) }
    );
  }

  componentDidUpdate() {
    var albumDict = makeAlbumDict(this.props.albumList);
    if ( !areSame(albumDict, this.state.albumDict) ||
      this.props.theme !== this.state.theme ||
      this.props.orderType != this.state.orderType
    ) {
      this.setState({
          albumDict: albumDict,
          theme: this.props.theme,
        },
        () => {this.reArrange(true) }
      );
    } else this.reArrange();
  }

  makeLayout(order) {
    var albumDict = makeAlbumDict(this.props.albumList);
    if (!order) order = Object.keys(albumDict);
    let albums = []
    let keys = []
    let suffix = 1;
    for (let i=0; i<order.length; i++) {
      let album = albumDict[order[i]];
        if (keys.includes(album.id)) {
          album.key = album.id.toString() + '-' + suffix.toString()
          suffix++
        } else {
          album.key = album.id
        }
        keys.push(album.key)
        albums.push(album)
    }
    this.setState({albums: albums});
  }

  reArrange(initial) {
    if (initial || this.state.orderType !== this.props.orderType) {
      this.setState({ orderType: this.props.orderType }, () => {
        if (this.state.orderType == "alpha") {
            this.makeLayout();
        } else {
          var albumDict = makeAlbumDict(this.props.albumList);
          var order = Object.keys(albumDict);
          order = shuffle(order);
          this.makeLayout(order);
        }
      });
    }
  }

  handlePinchIn() {
    var now = new Date().getTime();
    if (now < this.state.lastPinch + 500) return;
    this.setState({ lastPinch: now });
    this.props.setColumns(this.props.columns + 1)
  }

  handlePinchOut() {    
    var now = new Date().getTime();
    if (now < this.state.lastPinch + 500) return;
    this.setState({ lastPinch: now });
    this.props.setColumns(this.props.columns - 1)
  }

  render() {
    return (
      <div className={`main-album-grid ${this.props.theme}`}>
        {this.state.albums ? (
          <GestureDetector
            onPinchIn={this.handlePinchIn.bind(this)}
            onPinchOut={this.handlePinchOut.bind(this)}
            theme={this.props.theme}
            onScroll={this.props.hideToolbar}>
            <div className={`album-grid-css album-grid-${this.props.columns}`}
              theme={this.props.theme}>
              {this.state.albums.map( (album) =>
                 <Album
                    key={album.key}
                    play={this.props.play}
                    album={this.state.albumDict[album.id]}
                    offerPlayerSelect={this.props.offerPlayerSelect}
                    playerInstance={this.props.playerInstance}
                    library={this.props.library}
                    theme={this.state.theme}
                  />
                )}
            </div>
          </GestureDetector>
        ) : null}
      </div>
    );
  }
}

function makeAlbumDict(albums) {
  var albumDict = {};
  albums.forEach((album) => {
    albumDict[album.id] = album;
  });
  return albumDict;
}

var arraysMatch = function (arr1, arr2) {
  if (!arr1 || !arr2) {
    return false;
  }

  // Check if the arrays are the same length
  if (arr1.length !== arr2.length) return false;

  // Check if all items exist and are in the same order
  for (var i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) return false;
  }

  // Otherwise, return true
  return true;
};

function getAlbumOrderFromLayout(layout, albumDict) {
  var grid = {};
  var yValues = [];

  //future == send this from client
  const maxColumns = 10;

  yValues.sort(function (a, b) {
    return a - b;
  });
  var albums = [];
  yValues.forEach((y) => {
    var x = 0;
    while (x < maxColumns) {
      if (
        Object.keys(grid[y]).includes(x.toString()) &&
        !albums.includes(grid[y][x])
      ) {
        albums.push(grid[y][x]);
      }
      x++;
    }
  });

  return albums;
}

function shuffle(oldarray) {
  var array = [...oldarray];
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function areSame(firstDict, secondDict) {
  return JSON.stringify(firstDict) == JSON.stringify(secondDict);
}

export default AlbumGrid;
