import React, { Component } from "react";

import "./TopArtists.css";

/**
 * Proptypes
 * @param {} topArtists
 */
class TopArtists extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }


    render() {
        // console.log('in top artists component:', this.props.topArtists);

        return (
            <>
            {this.props.topArtists.map((artistObj) => (
                <div key={artistObj.id} className="TopArtists-div">
                    <img className="TopArtists-image" src={artistObj.images[0].url}/>
                    <p className="TopArtists-text">{artistObj.name}</p>
                </div>
            ))}
            </>
        );
    }
}

export default TopArtists;