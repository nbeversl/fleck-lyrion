import * as React from "react";
import { SearchInput } from "react-onsenui";
import CloseIcon from "../svg/CloseIcon";

class SearchBar extends React.Component {

   constructor(props) {
    super(props);
    this.inputRef = null;
  }

  componentDidMount() {
    if (!/Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
      setTimeout(this.findAndFocusInput, 0);
    }
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
        <form  onSubmit={this.handleSubmit.bind(this)}>
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
          <CloseIcon className="btn-icon" />
        </button>
      </div>
    );
  }
}

export default SearchBar;
