import { Album } from "../Album/Album.jsx";
import { LMSLibrary } from "../LMS/Library"; 
import AlbumType from "../types/AlbumType.tsx";
import ExtendedMetadata from "../Metadata/ExtendedMetadata";
import { Range } from "react-onsenui";
import { useEffect, useState } from "react";

type NowPlayingProps = {
  playerStatus: any;
  library: LMSLibrary;
  LMS: object;
  theme: string;
  checkPlayerInstance: object,
  play: any;
  trackPosition: number;
  handleSeekChange: object;
  playerInstance: any;
};

const NowPlaying = ({
  playerStatus, 
  library,
  playerInstance,
  trackPosition,
  LMS,
  play,
  handleSeekChange,
  theme,
  checkPlayerInstance}: NowPlayingProps ) => {

  const [xid, updateXid] = useState<any | null>(null)
  const [trackInfo, setTrackInfo] = useState<object | null>(null)
  const [albumPlaying, setAlbumPlaying] = useState<AlbumType | null>(null)

  useEffect(() => {
    getAlbumInfo();
  }, [playerStatus, library])

  useEffect(() => {
    getAlbumInfo();
  }, [playerStatus])

  const getTrackInfo = () => {
    if (playerStatus && playerStatus?.playlist_cur_index != undefined &&
      playerStatus.playlist_loop[parseInt(playerStatus?.playlist_cur_index)] != undefined &&
      playerStatus.playlist_loop.length == 1) 
        library.getTrackInfo(
          playerStatus.playlist_loop[parseInt(playerStatus?.playlist_cur_index)].id,
          (r: object) => { if (trackInfo != r) setTrackInfo(r) });
  }

  const getAlbumInfo = () => {
    if (playerStatus &&
      playerStatus.playlist_cur_index != undefined &&
      playerStatus.playlist_loop[parseInt(playerStatus.playlist_cur_index)] != undefined
    ) 
      library.getAlbumFromID(
        playerStatus.playlist_loop[parseInt(playerStatus.playlist_cur_index)].album_id,
        (album: AlbumType) => {
          if (!albumPlaying || album.id != albumPlaying.id) {setAlbumPlaying(album) }
        });
  }

  return (
    <div className="now-playing-container">
      {playerStatus &&
      playerStatus.playlist_loop &&
      playerStatus.playlist_cur_index != undefined && // can be 0
      playerStatus.playlist_loop[parseInt(playerStatus.playlist_cur_index)] ? (
        <div className={"now-playing"}>
          <div className="now-playing-album-cover">
            <Album
              album={albumPlaying}
              modal={true}
              theme={theme}
              play={play}
              library={library}
              checkPlayerInstance={checkPlayerInstance}
              playerInstance={playerInstance}
              LMS={LMS}
            />
          </div>
          <div className="now-playing-meta">
            <div className="now-playing-artist">
              { playerStatus.playlist_loop[parseInt(playerStatus.playlist_cur_index)].artist }
            </div>
            <div className="now-playing-album-title">
              { playerStatus.playlist_loop[parseInt(playerStatus.playlist_cur_index)].album }
            </div>
            { playerStatus.playlist_loop[parseInt(playerStatus.playlist_cur_index)].disc &&
              <div className="now-playing-disc-number">
                {" "}
                Disc{" "}
                { playerStatus.playlist_loop[parseInt(playerStatus.playlist_cur_index)].disc}
                {" "}
              </div>
            }
            <div className="now-playing-track-name">
              { playerStatus.playlist_loop[parseInt(playerStatus.playlist_cur_index)].tracknum }
              {". "}
              { playerStatus.playlist_loop[parseInt(playerStatus?.playlist_cur_index)].title }
            </div>
            { playerStatus.time &&
              <div className="track-range">
                 <Range
                  className="track-time"
                  value={trackPosition - 1}
                  onInput={handleSeekChange}
                 />
                <div className="timings">
                  <div className="elapsed">{formatTime(playerStatus.time)}</div>
                  <div className="remaining"> { playerStatus.duration > 0 && formatTime(playerStatus.duration - playerStatus.time)}</div>
                </div>
              </div>
            }
          </div>
        </div>
      ) : null}
    </div>
  );
}

const formatTime = (seconds: number) => {
  if (seconds < 1 ) return '0:00'
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

export default NowPlaying;
