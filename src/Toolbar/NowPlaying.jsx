import * as React from "react";
import '../style.css';
import { Album } from '../Album';
import ExtendedMetadata from "../Metadata/ExtendedMetadata";
import { Range } from 'react-onsenui';


class NowPlaying extends React.Component {
    
    constructor(props) {
        super(props)
        this.state = {
            xid : null,
            trackInfo : null,
            album : null,
        }
    }
    componentDidMount() {
       this.getAlbumInfo()
    }
    componentDidUpdate() {
        this.getAlbumInfo()
    }
   
    getTrackInfo() {
        this.props.library.getTrackInfo(this.props.playerStatus.playlist_loop[parseInt(this.props.playerStatus.playlist_cur_index)].id, (r) => {
            this.setState({trackInfo : r})
            try {
                var strucMeta = JSON.parse(r.comment);
                this.setState({xid: strucMeta})
            } catch (e) {
                console.log('Could not parse comment to JSON')
                console.log(e);
            }                       
        });
    }

    getAlbumInfo() {
    
         if (this.props.playerStatus
            && this.props.playerStatus.playlist_cur_index != undefined
            ) {
                console.log("HELLO")
                console.log(this.props.playerStatus);
            this.props.library.getAlbumFromID(this.props.playerStatus.playlist_loop[parseInt(this.props.playerStatus.playlist_cur_index)].album_id, (album) => {               
                if (!this.state.album || album.id != this.state.album.id) {
                    this.setState({
                        album:album,
                    });
                }
            });
        }
    
    }

    render() {
       
        return( 
           
            <div className="now-playing-container">
                {   this.props.playerStatus 
                    && this.props.playerStatus.playlist_loop 
                    && this.props.playerStatus.playlist_cur_index != undefined // can be 0
                    && this.props.playerStatus.playlist_loop[parseInt(this.props.playerStatus.playlist_cur_index)] ?

                        <div className={"now-playing"}>
                            <div className="info">
                            <div className="now-playing-album-cover">
                                    <Album
                                        album={this.state.album}
                                        modal={true}
                                        library={this.props.library}
                                        checkPlayerInstance={this.props.checkPlayerInstance}
                                        LMS={this.props.LMS}
                                    />
                                </div>  
                                <div className="now-playing-meta">
                                    <div className="now-playing-artist">{this.props.playerStatus.playlist_loop[parseInt(this.props.playerStatus.playlist_cur_index)].artist}</div> 
                                    <div className="now-playing-album-title">{this.props.playerStatus.playlist_loop[parseInt(this.props.playerStatus.playlist_cur_index)].album}</div>
                                    { this.props.playerStatus.playlist_loop[parseInt(this.props.playerStatus.playlist_cur_index)].disc ?
                                        <div className="now-playing-disc-number"> Disc {this.props.playerStatus.playlist_loop[parseInt(this.props.playerStatus.playlist_cur_index)].disc} </div>
                                        :
                                        null
                                    }
                                    <div className="now-playing-track-name">
                                        <p>{this.props.playerStatus.playlist_loop[parseInt(this.props.playerStatus.playlist_cur_index)].tracknum}. 
                                        {this.props.playerStatus.playlist_loop[parseInt(this.props.playerStatus.playlist_cur_index)].title}
                                        </p>
                                    </div>
                                
                                    { this.state.xid ? 
                                        <ExtendedMetadata 
                                            meta={this.state.xid.discs[0][this.props.playerStatus.playlist_cur_index]} 
                                            />
                                        : null
                                    } 
                                    <Range 
                                        className="track-time"
                                        value={ Math.floor(this.props.playerStatus.time / this.props.playerStatus.duration * 100) - 1} 
                                        onChange={this.props.handleSeekChange} />
                                </div>
                            </div>
                    </div>
                : null
                }
            </div>
        );
    }
}

export default NowPlaying;