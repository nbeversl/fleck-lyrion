
import { PlayerControls } from './PlayerControls';
import NowPlaying from './NowPlaying';
import { Toolbar, Segment } from 'react-onsenui';
import * as React from "react";
import SearchBar from './SearchBar';

class ControlBar extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            playerStatus: null,
        }
    }

    handleSeekChange (event)  {
        var newPosition = Math.floor(this.props.playerStatus.duration * event.target.value / 100 );
        this.props.playerInstance.seek( newPosition);
    }

    getPlayerStatus() {
        if ( ! this.props.targetPlayer ) { 
            return setTimeout(this.getPlayerStatus.bind(this), 5000); 
        }
        this.props.playerInstance.getPlayerStatus( (status) => {
            this.setState({ playerStatus: status}, 
                () => { 
                    setTimeout(this.getPlayerStatus.bind(this), 5000);
            });
        });
        
    }

    render() {
        return (
        
            <Toolbar className={this.props.scrollStyle}>
                <div className="control-bar">
                    <div className={"control-content "+this.props.scrollStyle}>                                                
                        
                        <NowPlaying
                            handleSeekChange={this.handleSeekChange.bind(this)}
                            playerStatus={this.state.playerStatus}
                            library={this.props.library}
                            checkPlayerInstance={this.props.checkPlayerInstance}
                            playerInstance={this.props.playerInstance}
                            LMS={this.props.LMS}
                            />
                        
                        <PlayerControls 
                            selectOpen={this.props.selectOpen}
                            closeSelect={this.props.closeSelect}
                            targetPlayer={this.props.targetPlayer}
                            switchPlayer={this.props.switchPlayer}   
                            getPlayerStatus={this.getPlayerStatus.bind(this)}   
                            toggleNowPlaying={this.props.toggleNowPlaying}
                            playerInstance={this.props.playerInstance}
                            playerStatus={this.state.playerStatus}
                            players={this.props.players}
                            library={this.props.library}
                            handleGenreChange={this.props.handleGenreChange}
                            genreSelected={this.props.genreSelected}
                            />
                            {  this.props.genreSelected ?
                                <div className="view-and-layout">
                                    <ViewSelector 
                                        showDrawer={this.props.showDrawer}
                                        searchFor={this.props.searchFor}
                                        handleViewChange={this.props.handleViewChange}
                                    />
                                    <div className="grid-controls">
                                        <Segment index={1}>
                                            <button className="order-select"
                                                onClick={() => this.props.setOrderType('shuffle')}>
                                                Shuffle
                                            </button>
                                            <button className="order-select"
                                                onClick={() => this.props.setOrderType('alpha')}>
                                                Alpha
                                            </button>
                                            <button className="order-select"
                                                onClick={() => this.props.setOrderType('shelf')}>
                                                Shelf
                                            </button>
                                        </Segment>
                                    </div>
                                    
                                </div>
                                : null
                            }
                        <SearchBar searchFor={this.props.searchFor} />                    
                    </div>    
                </div>
            </Toolbar>
        )
    }
}


class ViewSelector extends React.Component {
    render() {
        return (
            <div className="view-and-search-selector">
                <Segment index={0}>
                    <button 
                        className="view-selector grid" 
                        onClick={() => this.props.handleViewChange('grid')}>
                            Grid
                    </button>
                    <button 
                        className="view-selector composer-artist" 
                        onClick={() => this.props.handleViewChange('composer-list') }>
                            Composer/Artist                             
                    </button>
                </Segment>
            </div>
            );
    }
}


export { ControlBar };