import React, { Component } from "react";

import "./TopTracks.css";

/**
 * Proptypes
 * @param {[track objects]} data
 */
class TopTracks extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }


    render() {
        console.log(this.props.data[1])

        return (
            <>
            {this.props.data.map((trackObj) => (
                <div key={trackObj.id} className="TopTrack-div">
                    <img className="TopTrack-image" src={trackObj.album.images[0].url}/>
                    <p className="TopTrack-text">{trackObj.name}</p>
                </div>
            ))}
            </>
        );
    }
}

export default TopTracks;