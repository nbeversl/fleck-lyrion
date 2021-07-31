import * as React from "react";

class ArtistComposerListWithTracks extends React.Component {
    
    constructor(props) {
        this.state = {
            tracks :[]
        }
    }

    componentDidUpdate () {
       
        this.props.artists.forEach( (artist) => {
            this.props.library.searchTracksByArtist( artist.id, (result) => {
                if (result) {
                    result.forEach( (track) => {
                        var currentTracks = this.state.tracks;
                        if ( ! currentTracks.includes(track) ) {
                            currentTracks.push(result);
                            this.setState({tracks: currentTracks});
                        }
                    });
                }
            });
        });
    }

    render() {
        var Table = [];
        this.state.tracks.forEach( (track) => {
            Table.push(track.title);
        });     
        return( 
            <div>
                HERE IS THE ARTIST LIST
                {Table}
            </div>
        )
    }

}

export default ArtistListWithTracks;