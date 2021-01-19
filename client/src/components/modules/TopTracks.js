import React, { Component } from "react";

import "./TopTracks.css";

class TopTracks extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }


    render() {
        console.log(this.props.data[1])

        return (
            <>
            {this.props.data.map((title) => (
                <div key={title.id} className="TopTrack-div">
                    <img className="TopTrack-image" src={title.image}/>
                    <p className="TopTrack-text">{title.name}</p>
                </div>
            ))}
            </>
        );
    }
}

export default TopTracks;