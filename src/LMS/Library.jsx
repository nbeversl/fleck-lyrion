class LMSLibrary {
  constructor(LMS) {
    this.genres = {};
    this.albums = {};
    this.tracks = [];
    this.LMS = LMS;
  }

  establishLibrary(callback) {
    this.LMS.request(["", ["genres", "0", "1000"]], (r) => {
      r.result.genres_loop.forEach((item) => {
        this.genres[item.genre] = {};
        this.genres[item.genre].id = item.id;
        this.LMS.request(
          [
            "",
            [
              "albums",
              "0",
              "1000",
              "genre_id:" + item.id.toString(),
              "tags:ljaS",
              "sort:artflow",
            ],
          ],
          (r) => {
            r.result.albums_loop.forEach((album) => { album = assignAlbumArt(album) });
            this.genres[item.genre].albums = r.result.albums_loop;
          }
        );
      });
      if (callback) {
        callback(this);
      }
    });
  }

  getAllAlbumsforGenre(id, callback) {
    this.titles = [];
    this.LMS.request(
      [
        "",
        [
          "albums",
          "0",
          "50000",
          "genre_id:" + id.toString(),
          "tags:**id****e**ljatsS",
        ],
      ],
      (r) => {
        r.result.albums_loop.forEach((album) => {
          album = assignAlbumArt(album)
          this.albums[album.id] = album;
        });
        if (callback) {
          callback();
        }
      }
    );
  }

  getAllTracksForGenre(id) {
    this.LMS.request(
      [
        "",
        [
          "titles",
          "0",
          "10000",
          "genre_id:" + id.toString(),
          "tags:**t****o****l****i****e****m**",
        ],
      ],
      (r) => {
        if (r.result.count) {
          r.result.titles_loop.forEach((title) => {
            this.tracks.push(title);
          });
        }
      }
    );
  }

  getAlbumTracks(albumID, callback) {
    if (this.albums[albumID].tracks) {
      callback(this.albums[albumID].tracks)
    }
    this.LMS.request(
      [
        "",
        [
          "titles",
          "0",
          "500",
          "album_id:" + albumID,
          "sort:tracknum",
          "tags:**t****o****l****i****e****d**",
        ],
      ],
      (r) => {
        this.albums[albumID].tracks = r.result.titles_loop
        callback(r.result.titles_loop);
      }
    );
  }

  allAlbums(callback) {
    this.LMS.request(["", ["albums", "0", "10000", "tags:lj"]], (r) => {
      r.result.albums_loop.forEach((album) => {
        album = assignAlbumArt(album)
        this.albums[album.id] = album;
      });
      callback(r.result.albums_loop || []);
    });
  }

  searchAlbums(searchString, callback) {
    this.LMS.request(
      ["", ["albums", "0", "100", "search:" + searchString, "tags:ljaS"]],
      (r) => {
        callback(r.result.albums_loop || []);
      }
    );
  }

  getAlbumFromID(albumID, callback) {
    if (albumID) {
      this.LMS.request(
        [
          "",
          ["albums",
            "0",
            "100",
            "album_id:" + albumID.toString(),
            "tags:ljaSt"],
        ],
        (r) => {
          if (r.result.albums_loop) {
            const firstResult = r.result.albums_loop[0]
            firstResult = assignAlbumArt(firstResult)
            callback(firstResult);
          }
        }
      );
    }
  }

  getAlbumFromTrackID(TrackID, callback) {
    var track = this.getTrackInfo(TrackID, (info) => {
      if (track) {
        // this.LMS.request(["",["albums","0","100","album_id:"+albumID.toString(), "tags:ljaS"]], (r) => {
        // if (r.result.albums_loop) {
        //     callback(r.result.albums_loop[0]);
        // }
      }
    });
  }

  searchTracks(searchString, callback) {
    this.LMS.request(
      [
        "",
        [
          "titles",
          "0",
          "100",
          "search:" + searchString,
          "tags:id**e****o****t****m****u****a****l****J**",
        ],
      ],
      (r) => {
        callback(r.result.titles_loop || []);
      }
    );
  }

  searchContributors(searchString, callback) {
    this.LMS.request(
      ["", ["artists", "0", "100", "search:" + searchString]],
      (r) => {
        callback(r.result.artists_loop || []);
      }
    );
  }

  searchTracksByArtist(artist_id, callback) {
    this.LMS.request(
      [
        "",
        [
          "titles",
          "0",
          "100",
          "artist_id:" + artist_id,
          "tags:id**e****o****t****m****u****a****l****e**",
        ],
      ],
      (r) => {
        callback(r.result.titles_loop);
      }
    );
  }

  searchAlbumsByArtist(artist_id, callback) {
    this.LMS.request(
      ["", ["albums", "0", "100", "artist_id:" + artist_id, "tags:idjtla"]],
      (r) => {
        callback(r.result.albums_loop);
      }
    );
  }

  getPlaylists(callback) {
    this.LMS.request(
      ["", ["playlists", "0", "100", "tags:uplaylist"]],
      (r) => {}
    );
  }

  getTrackInfo(trackID, callback) {
    this.LMS.request(
      [
        "",
        [
          "songinfo",
          "0",
          "100",
          "track_id:" + trackID.toString(),
          "tags:gald**J****e****u****m**",
        ],
      ],
      (r) => {
        callback(r.result.songinfo_loop);
      }
    );
  }
}

const assignAlbumArt = (album) => {
  if (album.artwork_track_id) album.albumArtURL = '/music/'+ album.artwork_track_id+'/cover.jpg'
  else album.albumArtURL = false
  return album
}
export { LMSLibrary };
