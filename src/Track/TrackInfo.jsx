import * as React from "react";
import ExtendedMetadata from "../Metadata/ExtendedMetadata";

class TrackInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      xid: null,
    };
  }

  render() {
    var List = [];
    this.props.trackInfo.forEach((item) => {
      Object.keys(item).forEach((id) => {
        if (id == "duration") {
          List.push(
            <div key={id} className="info-item">
              {id} : {secondsToMinutes(item[id])}
            </div>
          );
          return;
        }

        if (id !== "comment") {
          List.push(
            <div key={id} className="info-item">
              {id} : {item[id]}
            </div>
          );
        }
        if (id === "comment") {
          if (this.state.xid == null) {
            try {
              var strucMeta = JSON.parse(item[id]);
              this.setState({ xid: strucMeta });
            } catch (e) {
              console.log("Could not parse comment to JSON");
              console.log(e);
            }
          }
        }
      });
    });

    return (
      <div className="track-info">
        {List}
        {this.state.xid ? (
          <ExtendedMetadata
            meta={this.state.xid.discs[this.props.disc][this.props.track]}
          />
        ) : (
          <div></div>
        )}
      </div>
    );
  }
}

function secondsToMinutes(seconds) {
  seconds = Math.floor(seconds);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds - minutes * 60;
  return (
    "" +
    minutes +
    ":" +
    remainingSeconds.toLocaleString("en", {
      minimumIntegerDigits: 1,
    })
  );
}

export default TrackInfo;
