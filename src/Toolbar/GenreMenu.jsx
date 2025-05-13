import * as React from "react";
import { Dialog, List, ListItem, ToolbarButton } from "react-onsenui";
import { Scrollbars } from "react-custom-scrollbars";

class GenreMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };
  }

  handleClose() {
    this.setState({isOpen: false})
  }
  handleOpen() {
    this.setState({isOpen: true})
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
          onClick={this.handleOpen.bind(this)}>
          <b>Genre</b> {this.props.genreSelected ? ': '+ this.props.genreSelected : ''}
        </ToolbarButton>
        {this.state.isOpen &&
          <Dialog
            animation={"none"}
            className={"genre-selector-dialog " + this.props.theme}
            isOpen={true}
            onCancel={this.handleClose.bind(this)}
            isCancelable={true}>
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
        }
      </div>
    );
  }
}

export { GenreMenu };
