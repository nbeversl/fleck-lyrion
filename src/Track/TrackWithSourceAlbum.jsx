import * as React from "react";
import { ToolbarButton , Card } from 'react-onsenui';
import { Album } from '../Album/Album';
import Play from '../svg/Play';
import Download from '../svg/Download';
import secondsToMinutes from "../helpers.js";

class TrackWithSourceAlbum extends React.Component {

  async playTrack(track) {
    var that = this;
    let playerInstance = this.props.playerInstance
    if (!playerInstance) {
      playerInstance = await this.props.offerPlayerSelect();
    }
    if (playerInstance) this.props.play(track, track.tracknum - 1); 
  }

  render() {
    let List = [];  
    let keys = []
    let suffix = 1;
    this.props.tracks.map( (track) => {
      if (keys.includes(track.id)) {
        track.key = track.id.toString() + '-' + suffix.toString()
        suffix++
      } else track.key = track.id
      keys.push(track.key)
      List.push( 
      <Card key={track.key}> 
        <div className="track-container">         
            <div className="track-info">
              <div className="title-codec-duration">
                <span className="track-title"> {track.title} </span> 
                <span className="duration"> ({ secondsToMinutes(track.duration) }) </span>
                <span className="codec"> { track.type === 'flc' ? 'FLAC' : track.type } </span>
              </div>
              <div><b>Artist</b>: {track.artist}</div>
              <div><b>Album</b>: {track.album} </div>
              <div>
                { track.disc ? <span><b>Disc</b>: {track.disc}; </span> : null }                            
                <span><b>Track</b>: {track.tracknum} </span>
              </div>
              <div>
                { decodeURI(track.url).replace("file://", "") }
              </div>
              <div className="track-buttons">
                <ToolbarButton onClick={ () => { this.playTrack(track) } } >
                  <Play className={"btn-icon"} />
                </ToolbarButton>
                <a href={"/music/"+track.id+"/download/"}>
                  <Download className="btn-icon download" />
                </a>   
              </div>
            </div>
            <div className="tracklist-album">                    
              <Album
                getFromId={track.album_id} 
                offerPlayerSelect={this.props.offerPlayerSelect}
                library={this.props.library}
                play={this.props.play}
                theme={this.props.theme}
              />
            </div> 
          </div>  
       </Card>
      );
    });
    return (
      <div>
        {List}
      </div>
    );
  }
}

export default TrackWithSourceAlbum;