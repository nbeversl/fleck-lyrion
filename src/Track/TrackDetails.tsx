import * as React from "react";
import ExtendedMetadata from "../Metadata/ExtendedMetadata";
import secondsToMinutes from "../helpers.js";
import { useEffect, useState } from "react";

type TrackDetailsProps = {
  trackInfo: { [key: string]: any }[];
  disc: number,
  track: number
}

const TrackDetails = ({ trackInfo, disc, track }: TrackDetailsProps) => {

  const [xid, updateXid] = useState<object | null>(null);
  const [list, setList] = useState<JSX.Element[]>([]);

  useEffect(() => {
    let list: JSX.Element[] = [];
    trackInfo.forEach((item) => {
      Object.keys(item).forEach((id) => {
        if (id === "duration") {
          list.push(
            <div key={id} className="info-item">
              <strong>{id}</strong> : {secondsToMinutes(item[id])}
            </div>
          );
        } else if (id === "url") {
          list.push(
            <div key={id} className="info-item">
              <strong>{id}</strong> : {decodeURI(item[id]).replace("file://", "")}
            </div>
          );
        } else if (id !== "comment") {
          list.push(
            <div key={id} className="info-item">
              <strong>{id}</strong> : {item[id]}
            </div>
          );
        } else if (id === "comment" && xid === null) {
          try {
            const strucMeta = JSON.parse(item[id]);
            updateXid(strucMeta);
          } catch (e) {
            console.log("Could not parse comment to JSON", e);
          }
        }
      });
    })
    setList(list)
  })

  return (
    <div className="track-details">
      {list}
    </div>
  );
}

export default TrackDetails;
