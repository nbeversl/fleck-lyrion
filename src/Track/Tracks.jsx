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
                        <Button onClick={() => this.props.playerInstance.playAlbumFromTrackAndContinue(track, track.tracknum)}>play</Button>
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
    playTrack(track) {
        console.log(track)
        var that = this;
        this.props.checkPlayerInstance( () => {
            that.props.playerInstance.playAlbumFromTrackAndContinue(track, track.tracknum); });
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
                                <Button onClick={ () => { 
                                    this.props.playerInstance.playAlbumFromTrackAndContinue(track, track.tracknum) } } >
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
                    onClick={ () => { 
                        this.props.playerInstance.playAlbumFromTrackAndContinuer(this.props.disc, this.props.track.tracknum) } } >Play
                </Button>
                <a href={"/music/"+this.props.track.id+"/download/"}>↓</a>
            </div>

        )
    }


}

export { TrackWithSourceAlbum, TrackList  }