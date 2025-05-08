import * as React from "react";
import { Album } from "../Album";
import { GestureDetector } from "react-onsenui";
import { Responsive, WidthProvider } from "react-grid-layout";

class AlbumGrid extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      shuffledAlbums: [],
      order: [],
      lastPinch: new Date().getTime(),
      genre: null,
      layout: null,
      orderType: null,
      albumSize: 200,
      columns: null,
      theme: null,
    };
  }

  componentDidMount() {
    var albumDict = makeAlbumDict(this.props.albumList);
    this.setState(
      {
        albumDict: albumDict,
        genre: this.props.genre,
        orderType: this.props.orderType,
        columns: this.props.columns,
        theme: this.props.theme,
      },
      () => {
        this.reArrange(true);
      }
    );
  }

  handleWidthChange(containerWidth, margin, cols, containerPadding) {
    this.setState({
      albumSize: containerWidth / cols,
    });
  }

  componentDidUpdate() {
    var albumDict = makeAlbumDict(this.props.albumList);
    if (
      this.props.genre !== this.state.genre ||
      !areSame(albumDict, this.state.albumDict) ||
      this.props.columns !== this.state.columns ||
      this.props.theme !== this.state.theme
    ) {
      if (this.props.layout) {
        this.setState({ layout: this.props.layout });
      }

      this.setState(
        {
          albumDict: albumDict,
          genre: this.props.genre,
          columns: this.props.columns,
          theme: this.props.theme,
        },
        () => {
          this.reArrange(true);
        }
      );
    } else {
      this.reArrange();
    }
  }

  reArrange(initial) {
    if (initial || this.state.orderType !== this.props.orderType) {
      this.setState({ orderType: this.props.orderType }, () => {
        switch (this.state.orderType) {
          case "shelf":
            if (this.props.storedLayout) {
              this.setState(
                {
                  cols: this.props.storedLayout.cols,
                },
                () => {
                  this.makeLayout(this.props.storedLayout.order);
                }
              );
            } else {
              var order = Object.keys(this.state.albumDict);
              this.makeLayout(order);
            }
            break;

          case "alpha":
            var order = Object.keys(this.state.albumDict);
            this.makeLayout(order);
            break;

          case "shuffle":
            var albumDict = makeAlbumDict(this.props.albumList);
            var order = Object.keys(albumDict);
            order = shuffle(order);
            this.makeLayout(order);
            break;
          default:
            break;
        }
      });
    }
  }

  moveToTop(id) {
    var order = this.state.order;
    order.pop(id.toString());
    order.unshift(id.toString());
    this.makeLayout(order);
  }

  makeLayout(order, callback) {
    var albums = [];

    order.forEach((album_id) => {

      if (!Object.keys(this.state.albumDict).includes(album_id)) {
        return;
      }

      albums.push(
        <Album
          key={album_id}
          moveable={this.props.moveable}
          album={this.state.albumDict[album_id]}
          checkPlayerInstance={this.props.checkPlayerInstance}
          library={this.props.library}
          LMS={this.props.LMS}
          moveToTop={this.props.moveToTop}
          theme={this.state.theme}
        />
      );
    });

    this.setState({
      albums: albums,
    });
    if (callback) {
      callback();
    }
  }

  handlePinchIn() {
    var now = new Date().getTime();
    if (now < this.state.lastPinch + 500) {
      return;
    }
    var cols = this.state.columns;
    if (cols < 10) {
      cols += 1;
      this.props.setColumns(10 - cols);
    }
    this.setState({
      lastPinch: now,
    });
  }

  handlePinchOut() {
    var now = new Date().getTime();
    if (now < this.state.lastPinch + 500) {
      return;
    }
    var cols = this.state.columns;
    if (cols > 0) {
      cols -= 1;
      this.props.setColumns(10 - cols);
    }

    this.setState({
      lastPinch: now,
    });
  }

  handleLayoutChange(layout, allLayouts) {
    if (this.state.orderType !== "shelf") {
      return;
    }
    var newOrder = getAlbumOrderFromLayout(layout, this.state.albumDict);
    if (!arraysMatch(newOrder, this.state.order)) {
      this.makeLayout(newOrder, () => {
        this.props.storeOrderChange({
          order: newOrder,
          cols: this.props.columns,
        });
      });
    }
  }

  render() {
    const ResponsiveGridLayout = WidthProvider(Responsive);
    return (
      <div className={`main-album-grid ${this.props.theme}`}>
        {this.state.albums ? (
          <GestureDetector
            onPinchIn={this.handlePinchIn.bind(this)}
            onPinchOut={this.handlePinchOut.bind(this)}
            theme={this.props.theme}
            onScroll={this.props.hideToolbar}>
            <div className={`album-grid-css album-grid-${this.state.columns}`}
              theme={this.props.theme}
              // onDragStop={this.handleLayoutChange.bind(this)}
              // onWidthChange={this.handleWidthChange.bind(this)}
              >
              {this.state.albums}
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
