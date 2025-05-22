import React from "react";
import { List, ListItem, ToolbarButton } from "react-onsenui";
import { Dialog } from "react-onsenui";

class PlayerSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activePlayer: this.props.selectedPlayer,
    };
  }

  render() {
    return (
      <div className={"player-selector " + this.props.theme}>
        <ToolbarButton onClick={this.props.openPlayerSelect}>
          <b>Player</b> {this.state.activePlayer ? ': '+ this.state.activePlayer : ''}
        </ToolbarButton>

        {this.props.playerSelectOpen &&
          <Dialog
            animation={"none"}
            className={this.props.theme}
            onCancel={this.props.closePlayerSelect}
            isCancelable={true}
            isOpen={true}>
            <div style={{ textAlign: "center" }}>
              <List
                dataSource={[{ name: "Browser (this device)" }].concat(...this.props.players)}
                renderRow={(row, idx) => (
                  <ListItem
                    key={row.name}
                    onClick={(e) => {
                      this.setState({activePlayer: row.name});
                      this.props.switchPlayer(row.name, () => {
                        this.props.getPlayerStatus();
                      });
                    }}
                    modifier="tappable"
                    tappable={true}>
                    {row.name}
                  </ListItem>
                )}
              />
            </div>
          </Dialog>
        }
      </div>
    );
  }
}

export { PlayerSelector };
