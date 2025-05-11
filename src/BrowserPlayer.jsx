import NoSleep from "nosleep.js";
class BrowserPlayer {
  
  constructor(LMS) {

    this.tracks = [];
    this.volume = 0;
    this.LMS = LMS;
    this.currentIndex = 0
    this.playing = false;
    this.audio = new Audio();
    this.isLoading = false;
    this.trackSelected = false;
    this.volume = 0

    this.getPlayerStatus = (callback) => {
      callback({
        time: this.audio ? this.audio.currentTime : 0,
        duration: this.audio ? this.audio.duration : 0,
        playlist_loop : this.tracks,
        playlist_cur_index : this.currentIndex,
        volume: this.volume
      })
    },

    this.seek = (time) => {
      this.audio.currentTime = time;
    }

    this.playAlbumFromTrackAndContinue = (track, startNumber) => {

      this.isLoading = true
      this.LMS.request(
        [
          "",
          [
            "titles",
            "0",
            "100",
            "album_id:" + track.album_id,
            "sort:tracknum",
            "tags:**t****o****l****i****e****m****a****e**",
          ],
        ],
        (r) => {
          this.tracks = r.result.titles_loop;
          for (let i=0; i< this.tracks.length; i++) {
            if (this.tracks[i].id == track.id) this.currentIndex = i;
          }
          this.trackSelected = true;
          this.playCurrentTrack()
      });
    }

    this.playCurrentTrack = () => {
      this.isLoading = true 
      if (this.audio) {
        this.audio.pause();
      }
      this.currentTrack = this.LMS.getTrack(this.tracks[this.currentIndex].id.toString())     
      this.audio.addEventListener('ended', this.nextTrack);
      this.audio.src = this.currentTrack
      this.audio.load()
      this.audio.play()
      this.volume = this.audio.volume
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
      this.volume = value
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

    this.playTrack = (track) => {
      this.isLoading = true
      this.LMS.request(
        [
          "",
          [
            "tracks",
            "0",
            "10",
            "track_id:" + track.id.toString(),
          ],
        ],
        (r) => {
          this.trackSelected = true;
          this.currentIndex = 0;
          this.tracks = r.result.titles_loop;
          this.playCurrentTrack()
      });
    };

    this.skipForward = () => {
      if (this.audio) {
        this.audio.currentTime = this.audio.currentTime + 15 
      }
    };

    this.skipBackward = () => {
      if (this.audio) {
        this.audio.currentTime = this.audio.currentTime - 15
      }
    };

  }
}

export { BrowserPlayer };
