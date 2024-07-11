import NoSleep from "nosleep.js";
import React, { useState, useRef, forwardRef, useImperativeHandle, useEffect } from 'react';

const BrowserPlayer = forwardRef((props, ref) => {

  const audioRef = useRef(null); // Ref to access the <audio> element
  const [playing, setPlaying] = useState(false)
  const address = ""
  const [tracks, setTracks] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(null);
  const noSleep = new NoSleep();
  const [showingElapsedTime, setShowingElapsedTime] = useState(null);
  const [time, setTime] = useState(0)
  const [duration, setDuration] = useState(null)
  const [src, setSourceTrack] = useState(null);
  const [readyToPlay, setReadyToPlay] = useState(false); // State to track if audio is ready to play
  const [isLoading, setIsLoading] = useState(true);
  const [audioLoaded, setAudioLoaded] = useState(false)
  const LMS = props.LMS

  // document.addEventListener("click", enableNoSleep, false);

  // Expose methods through ref

  useImperativeHandle(ref, () => ({
    // Method to play or pause the audio
    
    getPlayerStatus: (callback) => {
      callback({
        time: audioRef.current ? audioRef.current.currentTime : 0,
        duration: duration,
        playlist_loop : tracks,
        playlist_cur_index : currentIndex
      })
    },

    // Method to seek to a specific time in the audio
    seek: (time) => {
      if (audioRef.current) {
        setCurrentTime(time);
      }
    },

    // Method to get current playback time
    getCurrentTime: () => {
      return currentTime;
    },

    playAlbumFromTrackAndContinue: (track, startNumber) => {
      console.log('RUNNING')
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
          startNumber = parseInt(startNumber);
          setCurrentIndex(startNumber);
          setTracks(r.result.titles_loop);
          setIsLoading(false)
          setPlaying(true)
      });
    },

    playOrPause: () => {
      if (!audioRef.current) return;

      // Use the functional form of setState to ensure we have the latest state value
      setPlaying(prevPlaying => {
        if (prevPlaying) {
          setTime(audioRef.current.currentTime)
          audioRef.current.pause(); // Pause the audio
        } else {
          console.log(time)
          audioRef.current.currentTime = time;
          audioRef.current.play(); // Play the audio
        }
        return !prevPlaying; // Return the new state, which is the opposite of the previous state
      });
    },

    setVolume: (value) => {
      audioRef.current.volume = value / 100;
    },

    nextTrack: () => {
      if (currentIndex < tracks.length - 1) {
        setCurrentIndex(currentIndex+1);
      }
    },

    previousTrack: () => {
      if (currentIndex > 0) {
        setCurrentIndex(currentIndex-1);
      }
    }

  }));
  useEffect(() => {
    console.log('TIME TCHANGED', time)
  },[time])

  useEffect(() => {
    if (!isLoading && tracks.length > 0 && currentIndex >= 0 && currentIndex < tracks.length) {
      setSourceTrack(LMS.getTrack(tracks[currentIndex].id.toString()))
      setAudioLoaded(false)
    }
  }, [isLoading, tracks, currentIndex, LMS]); // Dependencies include isLoading, tracks, currentIndex, LMS

  useEffect(() => {
    if (src && audioRef.current) {
      if (!audioLoaded) {
        console.log('LOADING');
        audioRef.current.src = src; // Set the src directly
        audioRef.current.load();
        setAudioLoaded(true);
      }
      if (playing) {
        audioRef.current.play();
      }
    }
  }, [src, playing, audioLoaded]);
  
  useEffect(() => {
    console.log("playing changed:", playing);
  }, [playing]);
  
  // Update duration and time when metadata and timeupdate events occur
  useEffect(() => {
    if (audioRef.current) {
      const updateDuration = () => setDuration(audioRef.current.duration);
      const updateTime = () => setTime(audioRef.current.currentTime);
      const handleCanPlayThrough = () => {
        setReadyToPlay(true); // Audio is ready to play
        if (playing) {
          audioRef.current.currentTime = time; // Ensure the current time is set
          audioRef.current.play();
        }
      };

      audioRef.current.addEventListener('loadedmetadata', updateDuration);
      audioRef.current.addEventListener('timeupdate', updateTime);
      audioRef.current.addEventListener('canplaythrough', handleCanPlayThrough);

      return () => {
        audioRef.current.removeEventListener('loadedmetadata', updateDuration);
        audioRef.current.removeEventListener('timeupdate', updateTime);
        audioRef.current.removeEventListener('canplaythrough', handleCanPlayThrough);
      };
    }
  }, [playing, time]);

  const enableNoSleep = () => {
    document.removeEventListener("click", enableNoSleep, false);
    noSleep.enable();
  }

  const handleEnded = () => {
    nextTrack();
  }

  const playAlbum = (albumTitle) => {
    this.LMS.request(
      [this.address, ["playlist", "loadalbum", "*", "*", albumTitle]],
      (r) => {
        console.log(r)
      }
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
      seek(playerInstance.seek() - 10);
      audioRef.current.currentTime = seekTime;

      playerStatus.time -= 10;
    };

  const seek = (position) => {
  };

  const showElapsedTime = () => {
      playerStatus.time = seek();
      playerStatus.duration = this.playerInstance.duration();
      playerStatus.playlist_loop = tracks;
      playerStatus.playlist_cur_index = currentIndex;
      showingElapsedTime = setTimeout(showElapsedTime, 1000);
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
              src={`${src}#t=${time}`}
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
