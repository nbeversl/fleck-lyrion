import * as React from "react";
import { Album } from './Album';
import { Button, ProgressCircular } from 'react-onsenui';

class TrackList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            tracks:[]
        }
    }

    render() {
        
        let List = [];  
        Object.keys(this.state.tracks).forEach( (number) =>
            { 
                List.push( 
                    <li key={this.state.tracks[number].id}>
                        {this.state.tracks[number].title} ({this.state.tracks[number].type})
                        <Button onClick={() => this.props.playerInstance.playTrack(this.state.tracks[number].id)}>play</Button>
                    </li>
                );
            });
        return (
            this.state.tracks != [] ? 
            <div>{List}</div>
            :
            <ProgressCircular/>
        );
    }
}

class TrackWithSourceAlbum extends React.Component {
    //
    playTrack(trackID) {
        var that = this;
        this.props.checkPlayerInstance( () => {
            that.props.playerInstance.playTrack(trackID); });
    }

    render() {
        let List = [];  
        this.props.tracks.forEach( (track) => {

            List.push( 
                 <div key={track.id} className="list-track">            
                        <div className="track-info">
                            <span> 
                                {track.title} 
                            </span> 
                            <span className="codec">
                                { track.type == 'flc' ? 'FLAC' : track.type }                            
                            </span>

                            <div className="">
                                <Button onClick={ () => { this.playTrack(track.id) } } >
                                    <img className={"btn-icon"} src={"./html/icon/play.png"} />
                                </Button>
                           
                                <a href={"/music/"+track.id+"/download/"}>↓</a>
                            </div>
                            <div>Album: {track.album}</div>
                            <div>Track# {track.tracknum} </div>
                            <div>Artist: {track.artist}</div>
                            { track.disc ? <div>Disk: {track.disc} </div> : <div></div> }                            
                        </div>

                        <div className="tracklist-album">                   
                            <Album 
                                id={track.album_id} 
                                art={track.artwork_track_id}
                                checkPlayerInstance={this.props.checkPlayerInstance}
                                LMS={this.props.LMS}
                            />
                        </div>   
                 </div>
            );
        });
        return (
            <div>
                <a href="#tracks"></a><h2>Tracks</h2>
                {List}
            </div>
        );
    
    }
}


class TrackWithDetails extends React.Component {

    render() {
     
        return (
            <div>                       
                <span className="track-title"> 
                    {this.props.track.tracknum}: {this.props.track.title}
                </span> 
                <div className="codec">
                    { this.props.track.type == 'flc' ? 'FLAC'
                        : this.props.track.type }                            
                </div>
                <Button 
                    onClick={ () => { this.props.playTrack(this.props.disc, this.props.track.serverID) } } >Play
                </Button>
                <a href={"/music/"+this.props.track.id+"/download/"}>↓</a>
            </div>

        )
    }


}

export { TrackWithSourceAlbum, TrackList  }