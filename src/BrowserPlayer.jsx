import NoSleep from "nosleep.js";
class BrowserPlayer {
  
  constructor(LMS) {

    this.tracks = [];
    this.volume = 0;
    this.LMS = LMS;
    this.currentIndex = 0
    this.playing = false;
    this.audio = null;

    this.getPlayerStatus = (callback) => {
      callback({
        time: this.audio ? this.audio.currentTime : 0,
        duration: this.audio ? this.audio.duration : 0,
        playlist_loop : this.tracks,
        playlist_cur_index : this.currentIndex
      })
    },

    this.seek = (time) => {
      this.currentTime = time;
    }

    this.playAlbumFromTrackAndContinue = (track, startNumber) => {
      var albumID = track.album_id;
      this.LMS.request(
        [
          "",
          [
            "titles",
            "0",
            "100",
            "album_id:" + albumID,
            "sort:tracknum",
            "tags:**e**",
          ],
        ],
        (r) => {
          this.currentIndex = parseInt(startNumber);
          this.tracks = r.result.titles_loop;
          this.playing = true;
          this.playCurrentTrack()
      });
    }

    this.playCurrentTrack = () => {
      if (this.audio) {
        this.audio.pause();
      }
      this.currentTrack = this.LMS.getTrack(this.tracks[this.currentIndex].id.toString())     
      this.audio = new Audio(this.currentTrack)
      this.audio.load()
      this.audio.play()      
    }

    this.playOrPause = () => {
      if (this.playing) {
        this.audio.pause(); // Pause the audio
      } else {
        this.audio.play(); // Play the audio
      }
      this.playing = ! this.playing
    }

    this.setVolume = (value) => {
      this.audio.volume = value / 100;
    }

    this.nextTrack =  () => {
      if (this.currentIndex < this.tracks.length - 1) {
        this.currentIndex += 1;
        this.playCurrentTrack()
      }
    }

    this.previousTrack = () => {
      if (this.currentIndex > 0) {
        this.currentIndex -=1;
        this.playCurrentTrack()
      }
    }

    this.enableNoSleep = () => {
      document.removeEventListener("click", enableNoSleep, false);
      noSleep.enable();
    }

    this.playAlbum = (albumTitle) => {
      this.LMS.request(
        [this.address, ["playlist", "loadalbum", "*", "*", albumTitle]],
        (r) => {
          console.log(r)
        }
      );
    }

    this.playTrack = (id) => {
      this.LMS.request([this.address, ["playlist", "clear"]], (r) => {
        this.LMS.request(
          [
            address,
            ["playlistcontrol", "cmd:add", "track_id:" + id.toString()],
          ],
          (r) => {
            console.log(r)
          }
        );
      });
    };

    this.skipForward = () => {
      if (this.audio) {
        this.audio.currentTime = this.audio.currentTime + 10 
      }
    };

    this.skipBackward = () => {
      if (this.audio) {
        this.audio.currentTime = this.audio.currentTime - 10 
      }
    };

  }

}

export { BrowserPlayer };
