import React from 'react';
import { Popover,  List, ListItem, ToolbarButton } from 'react-onsenui';

class PlayerSelector extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            activePlayer: '',
            optionsShowing: false,
        }
    }
    render() {
        return (
            <div className="player-selector">
               <ToolbarButton
                    ref={(btn) => { this.btn = btn; }}
                    onClick={() =>
                        this.setState({target: this.btn, optionsShowing: true})
                    }>
            
                    <div><b>Player</b></div> { this.state.activePlayer ? this.state.activePlayer : null} 
                    
                </ToolbarButton>

                <Popover 
                    isOpen={this.state.optionsShowing}
                    onCancel={() => this.setState({optionsShowing: false})}
                    getTarget={() => this.state.target}
                    >
                    <div style={{textAlign: 'center', opacity: 0.5}}>
                    
                    <List 
                        dataSource={[{name:'This Device'}].concat(...this.props.players)}
                        renderRow={(row, idx) => (
                        <ListItem
                            onClick={(e) => {
                               this.setState({
                                   activePlayer:row.name,
                                   optionsShowing:false
                                });
                               this.props.switchPlayer(row.name, () => {
                                    this.props.getPlayerStatus();
                               });

                            }}
                            modifier="tappable" 
                            tappable={true}>
                            
                            {row.name}
                        </ListItem>
                        )}/>
                   
                    </div>
                       
                 </Popover>
            </div>
        )
    }
}

export { PlayerSelector };