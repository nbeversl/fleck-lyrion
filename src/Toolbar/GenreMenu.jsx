import * as React from "react";
import { Dialog, List, ListItem, ToolbarButton } from "react-onsenui";
import { Scrollbars } from "react-custom-scrollbars";

class GenreMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      genreSelected: this.props.genreSelected,
    };
  }

  componentDidUpdate() {
    if (this.props.genreSelected != this.state.genreSelected) {
      this.setState({genreSelected: this.props.genreSelected})
    }
  }

  render() {
    const DialogStyle = {
      height: window.innerHeight - 200,
      top: "40%",
    };

    return (
      <div className="genre-selector">
        <ToolbarButton
          className="order-select"
          onClick={() => this.setState({ isOpen: true })}>
          <b>Genre</b> {this.state.genreSelected ? ': '+ this.state.genreSelected : '(select)'}
        </ToolbarButton>

        <Dialog
          animation={"none"}
          isOpen={this.state.isOpen}
          className={`${this.props.theme} genre-menu`}>
          <Scrollbars style={DialogStyle}>
            <div className="content">
              <List
                dataSource={Object.keys(this.props.genres)}
                renderRow={(row, idx) => (
                  <ListItem
                    key={idx}
                    onClick={(e) => {
                      this.setState({
                        genreSelected: row,
                        isOpen: false,
                      });
                      this.props.handleGenreChange(row);
                    }}
                    modifier="tappable"
                    tappable={true}
                  >
                    {row}
                  </ListItem>
                )}
              />
            </div>
          </Scrollbars>
        </Dialog>
      </div>
    );
  }
}

export { GenreMenu };
