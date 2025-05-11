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
        <ToolbarButton
          onClick={() => {
            this.props.togglePlayerSelect();
            this.setState({
              target: this.btn,
            });
          }}
        >
          <b>Player</b> {this.state.activePlayer ? ': '+ this.state.activePlayer : ''}
        </ToolbarButton>

        <Dialog
          animation={"none"}
          className={"player-selector-dialog " + this.props.theme}
          isOpen={this.props.playerSelectOpen}
          onCancel={this.props.closeSelect}
          getTarget={() => this.state.target}
          cancelable={true}
        >
          <div style={{ textAlign: "center" }}>
            <List
              dataSource={[{ name: "Browser (this device)" }].concat(...this.props.players)}
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
                  tappable={true}>
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
