import * as React from "react";
import TrackListScrolling from "./TrackListScrolling";
import { ProgressCircular, ToolbarButton, Button, Dialog } from "react-onsenui";
import Disc from '../svg/Disc';
import CloseIcon from "../svg/CloseIcon";
import { useEffect, useState } from "react";
import AlbumType from "../types/AlbumType.tsx";
import { LMSLibrary } from "../LMS/Library";
import { Player } from "../LMS/Player.jsx"
import { BrowserPlayer } from "../BrowserPlayer"

type AlbumProps = {
  getFromId?: number;
  album: AlbumType,
  theme: string;
  LMS?: any,
  checkPlayerInstance: (callback: (playerInstance: any) => any) => any
  library: LMSLibrary
  playerInstance: Player | BrowserPlayer,
  play: (disc: string, trackNumber: string ) => void
}

const Album = ({
  getFromId,
  album,
  theme,
  library,
  checkPlayerInstance,
  LMS,
  playerInstance,
  play }: AlbumProps) => {
 
  const [discs, setDiscs] = useState<Record<string, any[]> | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [thisAlbum, setAlbum] = useState<AlbumType | null>(null);

  useEffect(() => {
    if (thisAlbum && getFromId && album && thisAlbum.id != getFromId) getAlbumFromId(); 
    else if (! thisAlbum || (album && thisAlbum.id != album.id)) setAlbum(album);
  }, [album])

  useEffect(() => {
    if (modalOpen && !discs) getMyTracks()
  },[modalOpen])

  const getAlbumFromId = async () => {
    const thisAlbum = await library.getAlbumFromID(getFromId)
    setAlbum(thisAlbum);
  }

  const getMyTracks = async () => {
    if (!thisAlbum) return
    const tracks: any = await library.getAlbumTracks(thisAlbum.id)
    const discs : Record<string, any[]> = {};
    tracks.forEach((track: any) => {
      var disc : string = track.disc;
      if (!disc) disc = "1"
      if (!Object.keys(discs).includes(disc)) discs[disc] = [];
      discs[disc].push(track);
    });
    setDiscs(discs);
    setModalOpen(true);
    const params = new URLSearchParams(window.location.search);
    const debug = params.get('debug');
    if (debug == 'true') console.log(album, tracks)
  }

  const handlePlay = (disc : string, trackNumber : string) => {
    if (!playerInstance) {
      setModalOpen(false)
      checkPlayerInstance((playerInstance) => {
        if (playerInstance) play(disc, trackNumber);
      });
    } else play(disc, trackNumber)
  }

  const handleOpen = (e: React.TouchEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    getMyTracks();
    setModalOpen(true);
  }

  const handleClose = () => {
    setModalOpen(false);
  }

  const backgroundImageStyle = {
    WebkitFilter: "blur(10px) saturate(2) opacity(.3)",
    filter: "blur(10px) saturate(2) opacity(.3)",
    backgroundImage: thisAlbum
      ? "url('/music/" + thisAlbum.artwork_track_id + "/cover.jpg')"
      : "",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
  };

  return (
    <div className="album">
      {thisAlbum &&
        <>
          <Button modifier="large--cta" onClick={handleOpen}>
            { ! thisAlbum.albumArtURL ? (
              <div className="album-no-artwork">
                <Disc className="album-no-artwork" />
                <div className="album-text-info">
                  <div className="album-title-text">
                    {thisAlbum.album}
                  </div>
                  <div className="album-artist-text">
                    {thisAlbum.artist}
                  </div>
                </div>
              </div>
            ) : ( 
              <img
                className="album-image"
                src={thisAlbum.albumArtURL}
                loading="lazy"
              />
            )}
          </Button>
          {modalOpen &&
            <Dialog
              className={"album-modal " + theme}
              isOpen={true}
              animation={"none"}
              onCancel={handleClose}
              isCancelable={true}
            >
              {discs ? (
                <div className="tracklist">
                  <TrackListScrolling
                    playerInstance={playerInstance}
                    discs={discs}
                    album={album}
                    addToPlaylist={playerInstance ? playerInstance.addTrack : null }
                    handlePlay={handlePlay}
                    checkPlayerInstance={checkPlayerInstance}
                    library={library}
                    cover={thisAlbum.albumArtURL}
                    LMS={LMS}
                  />
                  <div
                    className="album-background-image"
                    style={backgroundImageStyle}
                  />
                </div>
              ) : (
                <div className="album-loading">
                  <ProgressCircular />
                </div>
              )}
              <ToolbarButton className="hide-album-modal-button" 
                onClick={handleClose} >
                <CloseIcon className="btn-icon" />
              </ToolbarButton>
            </Dialog>
          }
        </>}
    </div>
  );
}

export { Album };
