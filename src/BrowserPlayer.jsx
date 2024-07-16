import NoSleep from "nosleep.js";
class BrowserPlayer {
  
  constructor(LMS) {

    this.tracks = [];
    this.volume = 0;
    this.LMS = LMS;
    this.currentIndex = 0
    this.playing = false;
    this.audio = null;
    this.isLoading = false;

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
      this.isLoading = true
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
          this.playCurrentTrack()
      });
    }

    this.playCurrentTrack = () => {
      this.isLoading = true 
      if (this.audio) {
        this.audio.pause();
      }
      this.currentTrack = this.LMS.getTrack(this.tracks[this.currentIndex].id.toString())     
      this.audio = new Audio(this.currentTrack)
      this.audio.addEventListener('ended', this.nextTrack);
      this.audio.load()
      this.audio.play()   
      this.playing = true
      this.isLoading = false 
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
      if (this.audio) {
        this.audio.volume = value / 100;
      }
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

    this.playTrack = (id) => {
      this.isLoading = true
      this.LMS.request(
        [
          "",
          [
            "tracks",
            "0",
            "10",
            "track_id:" + id.toString(),
          ],
        ],
        (r) => {
          this.currentIndex = 0;
          this.tracks = r.result.titles_loop;
          this.playCurrentTrack()
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
