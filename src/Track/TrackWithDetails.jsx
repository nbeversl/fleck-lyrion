import * as React from "react";
import { ToolbarButton  } from 'react-onsenui';
import '../style.css';
import TrackInfo from './TrackInfo';


class TrackWithDetails extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            trackInfo: null,
            showTrackInfo : false,
        }
    }

    toggleTrackInfo() {
        if (! this.state.trackInfo ) {
            this.props.library.getTrackInfo(this.props.track.id, (r) => {
                this.setState({trackInfo : r})
            });
        }
        this.setState({showTrackInfo : ! this.state.showTrackInfo});
    }
    tryDownload() {
        this.props.library.getTrackInfo(this.props.track.id, (r) => {
            this.setState({trackInfo : r})
            this.props.LMS.getTrack(this.state.trackInfo[0].id.toString())
        });
    }

    render() {

        return (
           
            <div className="track-info">
                <div className="title-and-codec">
                    <span className="track-title"> 
                        {this.props.track.tracknum}: {this.props.track.title}
                    </span> 
                    <span className="codec">
                        { this.props.track.type === 'flc' ? 'FLAC'
                            : this.props.track.type }                            
                    </span>
                </div>
                <div className="track-info-controls">
                    
                    <ToolbarButton 
                        onClick={ () => { 
                            this.props.playTrack(this.props.disc, this.props.track.serverID) } } >
                                <img className={"btn-icon"} src={"assets/icon/play.png"} />
                    </ToolbarButton>
                    <ToolbarButton onClick={ this.props.addToPlaylist ? () => { this.props.addToPlaylist(this.props.track.serverID) } :null}>
                        +
                    </ToolbarButton>
                    <ToolbarButton
                        onClick={ this.toggleTrackInfo.bind(this) } >
                            <div className="info-i"><div className="i">i</div></div>
                    </ToolbarButton>
                 
                </div>
                { this.state.trackInfo && this.state.showTrackInfo ? 
                    <div>
                        <hr/>
                        <ToolbarButton
                            className="ion-home color-primary item"
                            onClick={() => { window.open(this.props.LMS.getTrack(this.state.trackInfo[0].id.toString()) )} }>
                                 Download
                        </ToolbarButton>
                        <TrackInfo 
                            trackInfo={this.state.trackInfo} 
                            disc={this.props.disc}
                            track={this.props.track.tracknum}
                            />
                    </div>
                    :
                    <div></div>
                }
            </div>
        )
    }
}



export default TrackWithDetails;

