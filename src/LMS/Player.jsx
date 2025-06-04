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
      if (! this.playing) this.play();
      else this.pause();
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

    this.playAlbumFromTrackAndContinue = async (track, startNumber) => {
      this.isLoading = true
      await this.LMS.request([this.address, ["playlist", "clear"]])
      await this.LMS.request([this.address, ["playlist", "addtracks", "album.id=" + track.album_id]]);
      const playerStatus = await this.getPlayerStatus()
      // let absoluteTrack = 0
      // const totalTracks = result.playlist_loop.length
      // const requestedDisc = parseInt(track.disc)
      // const requestedTrack = parseInt(track.tracknum)
      for (let i=0; i < playerStatus.playlist_loop.length; i++) {
      
        if (playerStatus.playlist_loop[i].id == track.id) startNumber = i;
      }
      // for multi-disc sets, find absolute track number
      
      await this.LMS.request([
        this.address,
        ["playlist", "index", "+" + startNumber.toString()],
      ]);
      this.trackSelected = true;
      this.playing = true;
      this.isLoading = false
    };

    this.nextTrack = async () => {
      await this.LMS.request([this.address, ["playlist", "index", "+1"]], (r) => {});
      this.playing = true;
    };

    this.previousTrack = async () => {
      await this.LMS.request([this.address, ["playlist", "index", "-1"]], (r) => {});
      this.playing = true;
    };

    this.getPlayerStatus = async () => {
      const playerStatus = await this.LMS.request(
        [
          this.address,
          [
            "status",
            "0",
            "100",
            "tags:duration,time, mode, **playlist index**, **l**,**J**,**K**",
          ],
        ])
      if ( playerStatus.result &&
        playerStatus.result.playlist_loop &&
        playerStatus.result.playlist_cur_index != undefined && // can be 0
        playerStatus.result.playlist_loop[parseInt(playerStatus.result.playlist_cur_index)] ) {
          this.trackSelected = true
      } else this.trackSelected = false              
      if (playerStatus.result.mode == "play") this.playing = true
      else this.playing = false
      return playerStatus.result
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
