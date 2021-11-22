import React from "react";
import { List, ListItem, ToolbarButton } from "react-onsenui";
import { Dialog, List, ListItem, ToolbarButton } from "react-onsenui";

class PlayerSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activePlayer: this.props.selectedPlayer,
    };
  }

  render() {
    return (
      <div className="player-selector">
        <ToolbarButton
          ref={(btn) => {
            this.btn = btn;
          }}
          onClick={() => {
            this.props.togglePlayerSelect();
            this.setState({
              target: this.btn,
            });
          }}
        >
          <div>
            <b>Player</b>
          </div>
          {this.state.activePlayer ? this.state.activePlayer : null}
        </ToolbarButton>

        <Dialog
          className={"player-selector-dialog"}
          isOpen={this.props.selectOpen}
          onCancel={this.props.closeSelect}
          getTarget={() => this.state.target}
          isCancelable={true}
        >
          <div style={{ textAlign: "center", opacity: 0.5 }}>
            <List
              dataSource={[{ name: "Browser" }].concat(...this.props.players)}
              renderRow={(row, idx) => (
                <ListItem
                  key={row.name}
                  onClick={(e) => {
                    this.setState({
                      activePlayer: row.name,
                    });
                    this.props.switchPlayer(row.name, () => {
                      this.props.getPlayerStatus();
                    });
                  }}
                  modifier="tappable"
                  tappable={true}
                >
                  {row.name}
                </ListItem>
              )}
            />
          </div>
        </Dialog>
      </div>
    );
  }
}

export { PlayerSelector };
