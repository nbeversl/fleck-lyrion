class Player {
  constructor(LMS, address) {
    this.address = address;
    this.tracks = [];
    this.volume = 0;
    this.LMS = LMS;
    this.playing = false;
    this.isLoading = false;
    this.trackSelected = false;

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

    this.playTrack = (track) => {
        
      this.isLoading = true
      this.LMS.request([this.address, ["playlist", "clear"]], (r) => {
        this.LMS.request(
          [
            this.address,
            ["playlistcontrol", "cmd:add", "track_id:" + track.id.toString()],
          ],
          (r) => {
            this.LMS.request([this.address, ["play"]]);
            this.playing = true;
            this.trackSelected = true;
            this.isLoading = false
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
      this.isLoading = true
      var albumID = track.album_id;
      this.LMS.request([this.address, ["playlist", "clear"]], (r) => {
        this.LMS.request(
          [this.address, ["playlist", "addtracks", "album.id=" + albumID]],
          (r) => {
            this.getPlayerStatus( (result) => {
              for (let i=0; i< result.playlist_loop.length; i++) {
                if (result.playlist_loop[i].id == track.id) startNumber = i;
              }
              this.LMS.request([
                this.address,
                ["playlist", "index", "+" + startNumber.toString()],
              ]);
              this.trackSelected = true;
              this.playing = true;
              this.isLoading = false
            }) 
          }
        );
      });
    };
    this.nextTrack = () => {
      this.LMS.request([this.address, ["playlist", "index", "+1"]], (r) => {});
      this.playing = true;
    };

    this.previousTrack = () => {
      this.LMS.request([this.address, ["playlist", "index", "-1"]], (r) => {});
      this.playing = true;
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
      this.seek("+15");
    };

    this.skipBackward = () => {
      this.seek("-15");
    };

    this.getVolume();
  }
}

export { Player };
