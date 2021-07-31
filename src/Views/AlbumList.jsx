import Card from 'react-bootstrap/Card';
import * as React from "react";
import TrackList from '../Tracks';
import Card from 'react-bootstrap/Card';

class AlbumList extends React.Component {
    
    render() {
  
        let List = [];
        Object.keys(this.props.list).forEach( (id) =>
            { List.push(
                <Card key={this.props.list[id].id}>        
                        <Card.Body>
                             <Album 
                                name={this.props.list[id].album} 
                                id={this.props.list[id].id}
                                clickHandler={this.props.clickHandler}
                                art={this.props.list[id].artwork_track_id}
                                LMS={this.props.LMS}
                            />
                            <TrackList 
                                playerInstance={this.props.playerInstance} 
                                albumID={this.props.list[id].id}
                            />
                        </Card.Body>
                              
                </Card>
            )});
        return (
            <div>
            
                {List}
            </div>
        )
    }
}

export default AlbumList
