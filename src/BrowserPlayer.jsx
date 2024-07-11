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
  const [playerStatus, setPlayerStatus] = useState({});
  const [src, setSourceTrack] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const LMS = props.LMS

  // document.addEventListener("click", enableNoSleep, false);

  // Expose methods through ref

  useImperativeHandle(ref, () => ({
    // Method to play or pause the audio
    
    getPlayerStatus: (callback) => {
      
    },

    // Method to seek to a specific time in the audio
    seek: (time) => {
      if (audioRef.current) {
        audioRef.current.currentTime = time;
        setCurrentTime(time);
      }
    },

    // Method to get current playback time
    getCurrentTime: () => {
      return currentTime;
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
          setPlaying(true)
          setIsLoading(false)
      });
    },

     playOrPause: () => {
      switch (playing) {
        case false:
          console.log(playing)
          console.log('PLAYING')
          // audioRef.current.play();
          setPlaying(true)
          console.log(playing)
          break;
        case true:
          console.log('PAUSIGN')
          // audioRef.current.pause();
          // setPlaying(false)
          break;
        default:
          console.log('DEFAULAT')
          break;
      }
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
    if (!isLoading && tracks.length > 0 && currentIndex >= 0 && currentIndex < tracks.length) {
      console.log('SETTING SOURCE TRACT')
      setSourceTrack(LMS.getTrack(tracks[currentIndex].id.toString()))
    }
  }, [isLoading, tracks, currentIndex, LMS]); // Dependencies include isLoading, tracks, currentIndex, LMS

  useEffect(() => {
    if (src) {
      audioRef.current.load()
      audioRef.current.play()
      console.log(src)
      console.log("FROM USEEFFECT", playing)
    }
  }, [src]);



  useEffect(() => {
    console.log("src changed:", src);
  }, [src]);
  
  useEffect(() => {
    console.log("playing changed:", playing);
  }, [playing]);
 
  const clearPlaylist = () => {
    setTracks([]);
  };

  const enableNoSleep = () => {
    document.removeEventListener("click", enableNoSleep, false);
    noSleep.enable();
  }

  const handleEnded = () => {
    // setPlaying(false);
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
