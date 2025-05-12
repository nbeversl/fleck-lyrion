import * as React from "react";
import { Dialog, List, ListItem, ToolbarButton } from "react-onsenui";
import { Scrollbars } from "react-custom-scrollbars";

class GenreMenu extends React.Component {

  render() {
    const DialogStyle = {
      height: window.innerHeight - 200,
      top: "40%",
    };

    return (
      <div className="genre-selector">
        <ToolbarButton
          className="order-select"
          onClick={() => {
            this.props.toggleGenreSelect();
            this.setState({target: this.btn });
          }}>
          <b>Genre</b> {this.props.genreSelected ? ': '+ this.props.genreSelected : ''}
        </ToolbarButton>
        <Dialog
          animation={"none"}
          className={"player-selector-dialog " + this.props.theme}
          isOpen={this.props.genreSelectOpen}
          onCancel={this.props.closeGenreSelect}
          getTarget={() => this.state.target}
          cancelable={true}>
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
