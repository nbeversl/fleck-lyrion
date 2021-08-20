import * as React from "react";
import { Dialog,List, ListItem, ToolbarButton } from 'react-onsenui';
import { Scrollbars } from 'react-custom-scrollbars';


class GenreMenu extends React.Component {
    
    constructor(props) {
        super(props)
        this.state = {
            genresTable : [],
            trackList : [],
            albumSelected : null,
            albumSelectedID : null,
            selectOpen : false,
            genreSelected : '',
            target: null,

        }
    }

    render() {
        const DialogStyle = {
            height: window.innerHeight - this.props.controlBarHeight - 200,
            top: "40%",
        }
       
        return (

                <div className='genre-selector'>
                    <ToolbarButton className="order-select"
                        onClick={() =>
                            this.setState({selectOpen: ! this.state.selectOpen})
                     }> 
                     <div><b>Genre</b></div> { this.state.genreSelected ? this.state.genreSelected : null} 
                    
                    </ToolbarButton>

                <Dialog 
                    animationOptions={{duration: 0.1, delay: 0}}
                    isOpen={this.state.selectOpen}
                    onCancel={() => this.setState({selectOpen: false})}
                    cancelable
                    >
                   
                    <Scrollbars style={DialogStyle}>
                        <div className="content">
                            <List 
                                dataSource={Object.keys(this.props.genres)}
                                renderRow={(row, idx) => (
                                <ListItem
                                    key={idx}
                                    onClick={(e) => {
                                    this.setState({
                                            genreSelected:row,
                                            selectOpen:false
                                        });
                                    this.props.handleGenreChange(row)
                                    }}
                                    modifier="tappable" 
                                    tappable={true}
                                    >
                                    {row}
                                </ListItem>
                                )}/>
                        </div>
                    </Scrollbars>
                 </Dialog>
            </div> 

        )
    }
}

export { GenreMenu }