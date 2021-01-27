import React, { Component } from "react";
import Card from './Card'

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

    mapTracks = (trackObj) => {
        return (
            <Card key={trackObj.id} isCommon={trackObj.isCommon}>
                <div className="TopTracks-div">
                    <img className="TopTracks-image" src={trackObj.album.images[0].url}/>
                    <p className="TopTracks-text">{trackObj.name}</p>
                    <p className="TopTracks-text">{trackObj.artists.map((artist) => artist.name).join(', ')}</p>
                </div>
            </Card>
        )
    }
    render() {
        // console.log(this.props.data[1])
        if (!this.props.data) {
            return <div>Loading!</div>
        }

        return (
            <div className="TopTracks-grid">
            {this.props.data.map(this.mapTracks)}
            </div>
        );
    }
}

export default TopTracks;