class LMSLibrary {
  constructor(LMS) {
    this.genres = {};
    this.albums = {};
    this.tracks = [];
    this.LMS = LMS;
  }

  establishLibrary() {
    return new Promise( (resolve) => {
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
              resolve(this)
            }
          );
        });
      });
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
          "tags:**a****id****e**ljatsS",
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
          "tags:**t****o****l****i****e****m****a**",
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
    this.LMS.request(["", ["albums", "0", "10000", "tags:lj**a**"]], (r) => {
      r.result.albums_loop.forEach((album) => {
        album = assignAlbumArt(album)
        this.albums[album.id] = album;
      });
      callback(r.result.albums_loop || []);
    });
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

  async fullSearch(searchString) {
    // get matching tracks for search string
    const searchResultsByTrack = await this.searchTracks(searchString)

    // get matching artists for search string
    const artists = await this.searchContributors(searchString);

    // get matching tracks for matching artists
    const trackResults = await Promise.all(artists.map( (artist) => this.searchTracksByArtist(artist.id)));

    // consolidate tracks
    const searchResultsTracks = [ ...searchResultsByTrack, ...trackResults.map(result => result.titles_loop).flat()];
    // get matching albums for matching artists and flatten
    const albumResultsForArtists = await Promise.all(artists.map( (artist) => this.searchAlbumsByArtist(artist.id)));
    let searchResultsAlbums = []
    albumResultsForArtists.map(result => {
      searchResultsAlbums = [...searchResultsAlbums, ...result.albums_loop];
    })

    // get matching albums for search string
    const albumResults = await this.searchAlbums(searchString)

    // consolidate albums and remove duplicates
    searchResultsAlbums = [...albumResults, ...searchResultsAlbums]
    searchResultsAlbums = searchResultsAlbums.filter((value, index, self) => self.indexOf(value) === index);

    // get art for albums
    searchResultsAlbums = searchResultsAlbums.map( (album) => assignAlbumArt(album) )
    return { searchResultsTracks, searchResultsAlbums };
  }

  searchAlbums(searchString) {
    return new Promise( (resolve) => {
      this.LMS.request(
      ["", ["albums", "0", "100", "search:" + searchString, "tags:ljaS"]],
      (r) => {
        let albums = [] 
        if (r?.result?.albums_loop) {
          r.result.albums_loop.map( (album) => {
            album = assignAlbumArt(album)
            this.albums[album.id] = album
            albums.push(album)
          }) 
        }
        resolve(albums || []);
      })
    });
  }

  searchTracks(searchString, callback) {
    return new Promise( (resolve) => { 
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
          resolve(r.result.titles_loop || []);
        })
    })
  }

  async searchContributors(searchString, callback) {
    return new Promise( (resolve) => {
      this.LMS.request(
        ["", ["artists", "0", "100", "search:" + searchString]],
        (r) => {
          resolve(r.result.artists_loop || []);
        })
    })
  }

  async searchTracksByArtist(artist_id, callback) {
    return new Promise( (resolve) => {
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
        (r) => { resolve(r.result) }
      );
    })
  }

  searchAlbumsByArtist(artist_id, callback) {
    return new Promise ( (resolve) => {
        this.LMS.request([
          "", 
          [
            "albums",
            "0",
            "100",
            "artist_id:" + artist_id,
            "tags:idjtla"]],
        (r) => {
         resolve(r.result) });
    });
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
