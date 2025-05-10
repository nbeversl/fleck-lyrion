import * as React from "react";
import { SearchInput } from "react-onsenui";

class SearchBar extends React.Component {

   constructor(props) {
    super(props);
    this.inputRef = null;
  }

  componentDidMount() {
    setTimeout(this.findAndFocusInput, 0);
  }

  findAndFocusInput = () => {
    const inputEl = document.querySelector('.search-bar input');
    if (inputEl) {
      this.inputRef = inputEl;
      this.inputRef.focus();
    }
  };

  handleSubmit(event) {
    event.preventDefault();
    this.props.searchFor(this.props.searchString);
    this.clearSearchString()
  }

  clearSearchString(e) {
    this.props.setSearchString("")
    var input = document.getElementById('searchInput');
    input.focus();
  }

  render() {
    return (
      <div className="search-bar">
        <form onSubmit={this.handleSubmit.bind(this)}>
          <SearchInput
            ref={(ref) => {
              this.searchInputComponent = ref;
            }}
            id="searchInput"
            onInput={(event) => {
              this.props.setSearchString(event.target.value);
            }}
            value={this.props.searchString}
          />
        </form>
        <button
          className="search-clear-button"
          onClick={(e) => { this.clearSearchString(e)}} >
          x
        </button>
      </div>
    );
  }
}

export default SearchBar;
