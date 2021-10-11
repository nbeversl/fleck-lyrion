import React from 'react';
import { Yamaha } from '../Yamaha/Yamaha';
import {  Range, ToolbarButton } from 'react-onsenui';
import { GenreMenu } from './GenreMenu';
import { PlayerSelector } from './PlayerSelector';

class PlayerControls extends React.Component {
    
    constructor(props) {
        super(props)
        this.state = {
            volume : null,
            yamahaVolume :-0,
            nowPlayingShowing: false,
            yamaha: new Yamaha('http://10.0.0.68'),
            currentPlayerPlaying : false,
        }
    }
    
    setVolume(event) {    
        this.setState({volume : parseInt(event.target.value)})
        this.props.playerInstance.setVolume( this.state.volume );        
    }
    handleBackButton() {
        if (this.props.playerStatus.time < 3) {
            this.props.playerInstance.previousTrack()
        } else {
            this.props.playerInstance.seek(0);
        }
    }
   
    render() {
        return (
        
            <div className="player-bar">
                <div className="selectors">
                    <PlayerSelector 
                        togglePlayerSelect={this.props.togglePlayerSelect}
                        selectOpen={this.props.selectOpen}
                        openSelect={this.props.openSelect}
                        players={this.props.players} 
                        selectedPlayer={this.props.targetPlayer}
                        switchPlayer={this.props.switchPlayer}
                        getPlayerStatus={this.props.getPlayerStatus}
                    />
                    { this.props.library && this.props.library.genres ? 
                    <GenreMenu 
                        genres={this.props.library.genres}
                        library={this.props.library}
                        screenWidth={this.state.screenWidth}
                        handleGenreChange={this.props.handleGenreChange.bind(this)}
                        genreSelected={this.props.genreSelected}
                        controlBarHeight={this.props.controlBarHeight}
                    />
                    : null
                    }

                </div>
            { this.props.playerInstance ? 
                <div className="player-controls">
                        
                    { this.props.playerInstance.address == "Den" ? 
                        <div className="custom-den-controls">

                            <ToolbarButton className="player-control-button"  onClick={this.state.yamaha.togglePower}>
                                <img className={"btn-icon"} src={"./html/icon/power.png"}/> 
                            </ToolbarButton>
                            
                            <ToolbarButton className="player-control-button" onClick={this.state.yamaha.volumeDown}>
                                <img className={"btn-icon"} src={"./html/icon/minus.png"}/> 
                            </ToolbarButton>
                            
                            <ToolbarButton className="player-control-button" onClick={this.state.yamaha.volumeUp}>
                                <img className={"btn-icon"} src={"./html/icon/plus.png"}/> 
                            </ToolbarButton>                                        
                            
                            <ToolbarButton className="player-control-button"  onClick={this.state.yamaha.setAppleTV}>
                                <img className={"btn-icon"} src={"./html/icon/apple.png"}/> 
                            </ToolbarButton>                                     

                            <ToolbarButton className="player-control-button"  onClick={this.state.yamaha.setMediaCenter}>
                                <img className={"btn-icon"} src={"./html/icon/bug.png"}/>  
                            </ToolbarButton>
                        </div>
                        :       
                        null
                    }               
                    <div className="base-lms-controls">    
                        <ToolbarButton 
                            className="player-control-button" 
                            onClick={() => {
                                if ( this.props.playerInstance ) {  
                                                             
                                    this.setState({
                                        currentPlayerPlaying : this.state.currentPlayerPlaying ? false : true
                                    });
                                    this.props.playerInstance.pause();
                                }
                            }}> 
                            
                            {  ! this.state.currentPlayerPlaying ? 
                                <img className={"btn-icon"} src={"./html/icon/pause.png"} />
                                :
                                <img className={"btn-icon"} src={"./html/icon/play.png"} />
                            }   
                        </ToolbarButton>
                        
                        <ToolbarButton
                            onClick={ this.props.playerInstance.skipBackward } >
                                <img className={"btn-icon"} src={"./html/icon/10sec_backward-512.png"}/> 
                        </ToolbarButton> 
                        
                        <ToolbarButton
                            onClick={ this.props.playerInstance.skipForward } >
                                <img className={"btn-icon"} src={"./html/icon/10sec_forward-512.png"}/> 
                        </ToolbarButton> 

                        <ToolbarButton className="player-control-button" onClick={this.props.playerInstance ? this.handleBackButton.bind(this) : null}>
                            <img className={"btn-icon"} src={"./html/icon/previous.png"} />
                        </ToolbarButton>

                        <ToolbarButton className="player-control-button" onClick={this.props.playerInstance ? this.props.playerInstance.nextTrack : null}>
                            <img className={"btn-icon"} src={"./html/icon/next.png"} />
                        </ToolbarButton>
                       
                    </div>                      
        
                    { this.props.playerInstance.volume != null ?  
                        <div className={"slider-volume"}>
                            <Range
                                value={this.props.playerInstance.volume}
                                onChange={ this.setVolume.bind(this)}
                            />
                        </div>
                        :
                        null
                    }
                </div>
                :   
                null
            }
        </div>
        )      
    } 
}



export { PlayerControls }
