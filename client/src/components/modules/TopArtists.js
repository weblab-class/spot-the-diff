import React, { Component } from "react";
import Card from './Card';

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
        if (!this.props.topArtists) {
            return <div>Loading!</div>
        }

        return (
            <div className="TopArtists-grid">
            {this.props.topArtists.map((artistObj) => (
                <Card key={artistObj.id} isCommon={artistObj.isCommon}>
                    <div className="TopArtists-div">
                        <img className="TopArtists-image" src={artistObj.images[0].url}/>
                        <p className="TopArtists-text"><b>{artistObj.name}</b></p>
                    </div>
                </Card>
            ))}
            </div>
        );
    }
}

export default TopArtists;