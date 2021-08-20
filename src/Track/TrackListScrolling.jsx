import * as React from "react";
import { Scrollbars } from 'react-custom-scrollbars';
import TrackWithDetails from './TrackWithDetails';
import { ToolbarButton, ProgressCircular} from 'react-onsenui';

class TrackListScrolling extends React.Component {
  
   playTrack(disc, trackNumber) {
        console.log('trying to play')
    
        this.props.checkPlayerInstance( (playerInstance) => {
            console.log('PLAYER INSTANCE INS')
            console.log(playerInstance);
            if (playerInstance) {
                playerInstance.playAlbumFromTrackAndContinue(
                this.props.discs[disc][0], // disc doesn't matter, only passes the album ID 
                trackNumber)    
            }
        });
    }

    render() {

        const tracklistStyle = {
            width: "100%",
            position:'absolute',
            zIndex:"100",
            overflow:"hidden",
            maxWidth: "100%",
        }


        var numDiscs = Object.keys(this.props.discs);
        let List = [];  
        var serverID = 0;
        
        numDiscs.forEach( (disc) => { 
               
                if ( numDiscs.length > 1 ) {
                    List.push(<div 
                            className={"disc-number"} 
                            key={"DISC-"+disc.toString()}>
                                <hr></hr>DISC {disc}
                            </div>);
                }
                this.props.discs[disc].forEach( (track) =>
                    { 
                        var trackNumber = track.tracknum;
                        track.serverID = serverID;
                        List.push( 
                            <TrackWithDetails 
                                key={disc.toString()+'-'+trackNumber}
                                discs={this.props.discs}
                                disc={disc}
                                track={track}
                                trackNumber={trackNumber}
                                playTrack={this.playTrack.bind(this)}
                                addToPlaylist={this.props.addToPlaylist}
                                library={this.props.library}
                                LMS={this.props.LMS}
                            />
                        );
                    serverID++;
                    });
            });
            
        return (
            <div className="tracklist-container">
            { this.props.discs ? 
                <Scrollbars style={tracklistStyle}> 
                { this.props.moveable ? 
                    <ToolbarButton onClick={() => {
                        this.props.moveToTop(this.props.album.id);
                        this.setState({modalOpen:false})
                        }}>Move to top</ToolbarButton>
                    : null
                }     

                    <div className="album-info">
                        <div className="text-info">
                            <div className="tracklist-artist">{this.props.album.artist}</div>
                            <div className="tracklist-album-title">{this.props.album.album}</div>                   
                        </div>
                        <div className="mini-album-cover">
                            <img src={this.props.cover}/>
                        </div>
                    </div>
                    <hr/>
                    <div className="grid-tracklist">
                        {List}
                    </div>
                </Scrollbars>
                :
                <ProgressCircular/> 
                }
            </div>
        )
    }
}

export default TrackListScrolling;