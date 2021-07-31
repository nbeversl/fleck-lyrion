import * as React from "react";
import ArtistComposerList from './Views/ArtistComposerList';
import AlbumGrid from './Views/AlbumGrid';
import { BPMView } from './Views/BPMview';
import ScrollUpButton from "react-scroll-up-button";
import SearchResults from './Views/SearchResults';


class LibraryView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            view: null,
        }
    }
    handleAlbumChange(id, name) {    

        this.props.playerInstance.getAlbumTracks(id, 
            (result) => { 
                this.setState({trackList:result})
            });
        this.setState({albumSelected : name }); 
        this.setState({albumSelectedID : id });
    }
   
    componentDidMount() {
        this.setState({view:this.props.view})
    }
    componentDidUpdate() {
        if (this.props.view != this.state.view) {
            this.setState({view:this.props.view})
        }
    }
    render() {
         var view;
        switch(this.state.view) {   

            case('composer-list'):
                view = this.props.genreSelected ?
                    <ArtistComposerList 
                        albumList={this.props.library.genres[this.props.genreSelected].albums} 
                        library={this.props.library}
                        LMS={this.props.LMS}
                        checkPlayerInstance={this.props.checkPlayerInstance}
                        genreSelected={this.props.genreSelected} 
                        scrollStyle={this.props.scrollStyle}
                        layout={this.props.layout}
                        handleOrderChange={this.props.handleOrderChange}
                    />  
                : null;
                break;
                
            case('grid'):
            
                view =  this.props.genreSelected ?
                       
                    <AlbumGrid 
                        albumList={this.props.library.genres[this.props.genreSelected].albums}                                 
                        genre={this.props.genreSelected} 
                        clickHandler={this.handleAlbumChange} 
                        library={this.props.library} 
                        checkPlayerInstance={this.props.checkPlayerInstance}
                        LMS={this.props.LMS}
                        storeOrderChange={this.props.storeOrderChange}
                        storedLayout={this.props.storedLayout}
                        orderType={this.props.orderType}
                        moveable={this.props.albumsMoveable}
                        />
                    : null;
                    break;

            case('search'):

                view =  <SearchResults 
                            screenWidth={this.props.screenWidth}
                            searchResultsAlbums={this.props.searchResultsAlbums}
                            searchResultsTracks={this.props.searchResultsTracks}
                            searchResultsContributors={this.props.searchResultsContributors} 
                            library={this.props.library}
                            checkPlayerInstance={this.props.checkPlayerInstance}
                            LMS={this.props.LMS}
                            playerInstance={this.props.playerInstance}
                        />
                break;

                }
        return (
            <div>
                    {view}
                    <ScrollUpButton />
            </div>
        )
        }
        
    }

export { LibraryView }