import * as React from "react";
import { ToolbarButton , Card } from 'react-onsenui';
import '../style.css';
import { Album } from '../Album';
import Play from '../svg/Play';
import Download from '../svg/Download';

class TrackWithSourceAlbum extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            albums : {},
        }
    }

    playTrack(trackID) {
        var that = this;
        this.props.checkPlayerInstance( () => {
            that.props.playerInstance.playTrack(trackID); });
    }

    render() {
        let List = [];  
        this.props.tracks.forEach( (track) => {

            List.push( 
                <Card key={track.id} >  
                    <div className="track-container">         
                        <div className="track-info">
                            <div>
                                <span className="track-title"> {track.title} </span> 
                                <span className="codec"> { track.type === 'flc' ? 'FLAC' : track.type } </span>
                            </div>
                            
                            <div><b>Artist</b>: {track.artist}</div>
                            <div><b>Album</b>: {track.album} {track.album_id} </div>
                            <div>
                                { track.disc ? <span><b>Disc</b>: {track.disc}; </span> : null }                            
                                <span><b>Track</b>: {track.tracknum} </span>
                            </div>
                            <div className="track-buttons">
                                <ToolbarButton onClick={ () => { this.playTrack(track.id) } } >
                                    <Play className={"btn-icon"} />
                                </ToolbarButton>

                                <a href={"/music/"+track.id+"/download/"}>
                                    <Download className="btn-icon" />;
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