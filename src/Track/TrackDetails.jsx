import * as React from "react";
import ExtendedMetadata from "../Metadata/ExtendedMetadata";
import secondsToMinutes from "../helpers.js";

class TrackDetails extends React.Component {
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
              <strong>{id}</strong> : {secondsToMinutes(item[id])}
            </div>
          );
          return
        }

        if (id == "url") {
          List.push(
            <div key={id} className="info-item">
              <strong>{id}</strong> : {decodeURI(item[id]).replace("file://", "")}
            </div>
          );
          return
        }

        if (id !== "comment") {
          List.push(
            <div key={id} className="info-item">
              <strong>{id}</strong> : {item[id]}
            </div>
          );
          return
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
      <div className="track-details">
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

export default TrackDetails;
