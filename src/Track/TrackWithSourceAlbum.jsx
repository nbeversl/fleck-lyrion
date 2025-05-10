import * as React from "react";
import { ToolbarButton , Card } from 'react-onsenui';
import '../style.css';
import { Album } from '../Album';
import Play from '../svg/Play';
import Download from '../svg/Download';
import secondsToMinutes from "../helpers.js";

class TrackWithSourceAlbum extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            albums : {},
            isLoading: false,
        }
    }

    playTrack(track) {
        var that = this;
        console.log(track.tracknum - 1)
        this.props.checkPlayerInstance( () => {
            that.props.playerInstance.playAlbumFromTrackAndContinue(track, track.tracknum - 1); 
        });
    }

    render() {
        let List = [];  
        this.props.tracks.forEach( (track) => {
            List.push( 
                <Card key={track.id} >  
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
                                checkPlayerInstance={this.props.checkPlayerInstance}
                                library={this.props.library}
                                LMS={this.props.LMS}
                                handle={false}
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