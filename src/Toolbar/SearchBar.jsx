import * as React from "react";
import { ToolbarButton, SearchInput } from  'react-onsenui';

class SearchBar extends React.Component {
    
    constructor(props) {
        super(props)
        this.state = {
            searchString: '',
        }
    }
    handleSubmit(event) {
        event.preventDefault();
        this.props.searchFor(this.state.searchString);
    }
  
    clearSearchString() {
        this.setState({searchString:''});
    }
    
    render () {
    
        return (
            <div className="search-bar">
                <form onSubmit={this.handleSubmit.bind(this) }>
                    <SearchInput
                        onChange={(event) => { this.setState({searchString: event.target.value})} }
                        value={this.state.searchString}
                        placeholder='search'
                    />
                </form>
            </div>
        )
    }
}

export default SearchBar;