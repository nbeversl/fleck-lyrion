import * as React from "react";

class ExtendedMetadata extends React.Component {

    render() {
        var Display = [];
        var personnel = this.props.meta.personnel;        
        var names = Object.keys(personnel);
        names.forEach( (name) => {
            Display.push(
                <div className={"personnel"}>
                    <b>{name}</b> : {personnel[name]}
                </div>
            )
        })
        return(
            <div>
                {Display}
            </div>
        )
    }
}

export default ExtendedMetadata;