import { Howl } from "howler";
import NoSleep from "nosleep.js";
class BrowserPlayer {
  constructor(LMS) {
    this.address = "";
    this.playerInstance = null;
    this.tracks = [];
    this.currentIndex = null;
    this.noSleep = new NoSleep();
    this.browser = true;
    this.playing = false;
    this.showingElapsedTime = null;
    this.LMS = LMS;
    this.playerStatus = {};

    // https://github.com/richtr/NoSleep.js
    // Enable wake lock.
    // (must be wrapped in a user input event handler e.g. a mouse or touch handler)

    const enableNoSleep = () => {
      document.removeEventListener("click", enableNoSleep, false);
      this.noSleep.enable();
    };

    document.addEventListener("click", enableNoSleep, false);

    this.play = () => {
      this.playerInstance.play();
      this.playing = true;
      this.showingElapsedTime = this.showElapsedTime();
    };

    this.pause = () => {
      if (this.playerInstance && this.playerInstance.playing()) {
        this.playerInstance.pause();
        this.playing = false;
        clearTimeout(this.showingElapsedTime);
      } else if (this.playerInstance) {
        this.play();
      }
    };

    this.playAlbum = (albumTitle) => {
      this.LMS.request(
        [this.address, ["playlist", "loadalbum", "*", "*", albumTitle]],
        (r) => {}
      );
    };

    this.playTrack = (id) => {
      this.LMS.request([this.address, ["playlist", "clear"]], (r) => {
        this.LMS.request(
          [
            this.address,
            ["playlistcontrol", "cmd:add", "track_id:" + id.toString()],
          ],
          (r) => {}
        );
      });
    };

    this.setVolume = (value) => {
      this.playerInstance.volume(value / 100);
    };

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
          startNumber = parseInt(startNumber);
          this.currentIndex = startNumber;
          this.tracks = r.result.titles_loop;
          this.clearPlaylist();
          this.playerInstance = new Howl({
            src: [
              this.LMS.getTrack(this.tracks[this.currentIndex].id.toString()),
            ],
            onend: () => {
              this.nextTrack();
            },
            onload: () => {
              this.play();
            },
          });
          this.play();
        }
      );
    };
    this.clearPlaylist = () => {
      if (this.playerInstance) {
        this.playerInstance.stop();
        //this.playerInstance.unload();
      }
    };

    this.nextTrack = () => {
      this.clearPlaylist();
      if (this.currentIndex < this.tracks.length - 1) {
        this.currentIndex++;
        this.playerInstance = new Howl({
          src: [
            this.LMS.getTrack(this.tracks[this.currentIndex].id.toString()),
          ],
          onend: () => {
            this.nextTrack();
          },
          onload: () => {
            this.play();
          },
        });
        this.playerInstance.play();
      }
    };

    this.previousTrack = () => {
      this.clearPlaylist();
      if (this.currentIndex > 0) {
        this.currentIndex--;

        this.playerInstance = new Howl({
          src: [
            this.LMS.getTrack(this.tracks[this.currentIndex].id.toString()),
          ],
          onend: () => {
            this.nextTrack();
          },
          onload: () => {
            this.play();
          },
        });
        this.playerInstance.play();
      }
    };

    this.getPlayerStatus = (callback) => {
      callback(this.playerStatus);
    };

    this.skipForward = () => {
      this.playerInstance.seek(this.playerInstance.seek() + 10);
      this.playerStatus.time += 10;
    };

    this.skipBackward = () => {
      this.seek(this.playerInstance.seek() - 10);
      this.playerStatus.time -= 10;
    };

    this.seek = (position) => {
      this.playerInstance.seek(position);
    };

    this.showElapsedTime = () => {
      this.playerStatus.time = this.playerInstance.seek();
      this.playerStatus.duration = this.playerInstance.duration();
      this.playerStatus.playlist_loop = this.tracks;
      this.playerStatus.playlist_cur_index = this.currentIndex;
      this.showingElapsedTime = setTimeout(this.showElapsedTime, 1000);
    };
  }
}

export { BrowserPlayer };
