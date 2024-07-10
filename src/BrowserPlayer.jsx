import NoSleep from "nosleep.js";
import React, { useState, useRef, forwardRef, useImperativeHandle, useEffect } from 'react';

const BrowserPlayer = forwardRef((props, ref) => {

  const audioRef = useRef(null); // Ref to access the <audio> element
  const [isPlaying, setIsPlaying] = useState(false)
  const address = ""
  const [tracks, setTracks] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(null);
  const noSleep = new NoSleep();
  const [showingElapsedTime, setShowingElapsedTime] = useState(null);
  const [playerStatus, setPlayerStatus] = useState({});
  const [src, setSourceTrack] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const LMS = props.LMS

  // Expose methods through ref

  useImperativeHandle(ref, () => ({
    // Method to play or pause the audio
    getPlayerStatus: (callback) => {
      LMS.request(
        [
          address,
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
    },
    // Method to set a new audio source and play it
    setAudioSource: (newSrc) => {
      setSrc(newSrc);
      if (audioRef.current) {
        audioRef.current.load(); // Reload the audio element with the new source
        audioRef.current.play(); // Start playing the new audio
        setIsPlaying(true);
      }
    },
    // Method to seek to a specific time in the audio
    seekTo: (time) => {
      if (audioRef.current) {
        audioRef.current.currentTime = time;
        setCurrentTime(time);
      }
    },
    // Method to get current playback time
    getCurrentTime: () => {
      return currentTime;
    },
    // Method to check if audio is currently playing
    isPlaying: () => {
      return isPlaying;
    },

    playAlbumFromTrackAndContinue: (track, startNumber) => {
      var albumID = track.album_id;
      setIsLoading(true)
      LMS.request(
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
          clearPlaylist();
          startNumber = parseInt(startNumber);
          setCurrentIndex(startNumber);
          setTracks(r.result.titles_loop);
          setIsLoading(false)
      });
    },

    play: () => {
      setIsPlaying(true);
      console.log(src)
      console.log(audioRef)
      
    },

    setVolume: (value) => {
      playerInstance.volume(value / 100);
    },

    nextTrack: () => {
      clearPlaylist();
      if (currentIndex < tracks.length - 1) {
        setCurrentIndex(currentIndex+1);
      }
    },

    previousTrack: () => {
      clearPlaylist();
      if (currentIndex > 0) {
        setCurrentIndex(currentIndex-1);
      }
    }

  }));

  useEffect(() => {
    // Ensure tracks and currentIndex are updated before setting sourceTrack
    if (!isLoading && tracks.length > 0 && currentIndex >= 0 && currentIndex < tracks.length) {
      console.log(tracks)
      setSourceTrack(LMS.getTrack(tracks[currentIndex].id.toString()))
    }
  }, [isLoading, tracks, currentIndex, LMS]); // Dependencies include isLoading, tracks, currentIndex, LMS


  useEffect(() => {
    if (src) {
      audioRef.current.load()
      audioRef.current.play()
    }
  }, [src]);

  const clearPlaylist = () => {
    setTracks([]);
  };

  const enableNoSleep = () => {
    document.removeEventListener("click", enableNoSleep, false);
    noSleep.enable();
  }

  document.addEventListener("click", enableNoSleep, false);

 

  const pause = () => {
    if (isPlaying) {
      audioRef.current.pause();      
      setIsPlaying(false);
      clearTimeout(showingElapsedTime);
    } else  {
      audioRef.current.play();      
    }
  }

  const handleEnded = () => {
    setIsPlaying(false);
  }

  const playAlbum = (albumTitle) => {
    this.LMS.request(
      [this.address, ["playlist", "loadalbum", "*", "*", albumTitle]],
      (r) => {}
    );
  }

  const playTrack = (id) => {
    LMS.request([this.address, ["playlist", "clear"]], (r) => {
      LMS.request(
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


  const skipForward = () => {
    playerStatus.time += 10;
  };

  const skipBackward = () => {
      seek(this.playerInstance.seek() - 10);
      audioRef.current.currentTime = seekTime;

      this.playerStatus.time -= 10;
    };

  const seek = (position) => {
  };

  const showElapsedTime = () => {
      playerStatus.time = this.playerInstance.seek();
      playerStatus.duration = this.playerInstance.duration();
      playerStatus.playlist_loop = this.tracks;
      playerStatus.playlist_cur_index = this.currentIndex;
      showingElapsedTime = setTimeout(this.showElapsedTime, 1000);
  };

  return (
      <div>
        <h2>FLAC Player</h2>
        { src && (
          <div> 
          <audio 
            ref={audioRef}
            onEnded={handleEnded}>    
            <source
              src={src}
              type="audio/flac"
              />
            Your browser does not support the audio element.
          </audio>
        </div>
        )}
      </div>
  )

});

export { BrowserPlayer };
