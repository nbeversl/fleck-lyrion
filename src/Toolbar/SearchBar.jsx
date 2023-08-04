import * as React from "react";
import { SearchInput } from "react-onsenui";

class SearchBar extends React.Component {
  handleSubmit(event) {
    event.preventDefault();
    this.props.searchFor(this.props.searchString);
  }

  render() {
    return (
      <div className="search-bar">
        <form onSubmit={this.handleSubmit.bind(this)}>
          <SearchInput
            onInput={(event) => {
              this.props.setSearchString(event.target.value);
            }}
            value={this.props.searchString}
            placeholder="search"
          />
        </form>
      </div>
    );
  }
}

export default SearchBar;
