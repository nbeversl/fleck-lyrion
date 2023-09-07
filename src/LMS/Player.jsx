class Player {
  constructor(LMS, address) {
    this.address = address;
    this.tracks = [];
    this.volume = 0;
    this.LMS = LMS;
    this.playing = false;

    this.playOrPause = () => {
      switch (this.playing) {
        case false:
          this.play();
          break;
        case true:
          this.pause();
          break;
        default:
          break;
      }
    };

    this.play = () => {
      this.LMS.request([this.address, ["play"]]);
      this.playing = true;
    };

    this.pause = () => {
      this.LMS.request([this.address, ["pause"]]);
      this.playing = false;
    };

    this.playAlbum = (albumTitle) => {
      this.LMS.request(
        [this.address, ["playlist", "loadalbum", "*", "*", albumTitle]],
        (r) => {
          this.play();
        }
      );
    };

    this.playTrack = (id) => {
      this.LMS.request([this.address, ["playlist", "clear"]], (r) => {
        this.LMS.request(
          [
            this.address,
            ["playlistcontrol", "cmd:add", "track_id:" + id.toString()],
          ],
          (r) => {
            this.LMS.request([this.address, ["play"]]);
            this.playing = true;
          }
        );
      });
    };

    this.addTrack = (id) => {
      this.LMS.request([
        this.address,
        ["playlistcontrol", "cmd:add", "track_id:" + id.toString()],
      ]);
    };

    this.savePlayList = (filename) => {
      this.LMS.request([
        this.address,
        ["playlistcontrol", "cmd:save", filename],
      ]);
    };

    this.setVolume = (value) => {
      this.LMS.request(
        [this.address, ["mixer", "volume", value.toString()]],
        (r) => {
          this.volume = value;
        }
      );
    };

    this.getVolume = () => {
      this.LMS.request([this.address, ["mixer", "volume", "?"]], (r) => {
        this.volume = parseInt(r.result._volume);
      });
    };

    this.playAlbumFromTrackAndContinue = (track, startNumber) => {
      var albumID = track.album_id;
      this.LMS.request([this.address, ["playlist", "clear"]], (r) => {
        this.LMS.request(
          [this.address, ["playlist", "addtracks", "album.id=" + albumID]],
          (r) => {
            this.LMS.request([
              this.address,
              ["playlist", "index", "+" + startNumber.toString()],
            ]);
            this.playing = true;
          }
        );
      });
    };
    this.nextTrack = () => {
      this.LMS.request([this.address, ["playlist", "index", "+1"]], (r) => {});
    };

    this.previousTrack = () => {
      this.LMS.request([this.address, ["playlist", "index", "-1"]], (r) => {});
    };

    this.getPlayerStatus = (callback) => {
      this.LMS.request(
        [
          this.address,
          [
            "status",
            "0",
            "100",
            "tags:duration,time, mode, **playlist index**, **l**,**J**,**K**",
          ],
        ],
        (r) => {
          callback(r.result);
        }
      );
    };

    this.ElapsedTimePerecent = (callback) => {
      this.LMS.request([this.address, ["time", "?"]], (r) => {
        callback(r.result._time);
      });
    };

    this.seek = (seconds) => {
      this.LMS.request([this.address, ["time", seconds]]);
    };

    this.skipForward = () => {
      this.seek("+10");
    };

    this.skipBackward = () => {
      this.seek("-10");
    };

    this.getVolume();
  }
}

export { Player };
