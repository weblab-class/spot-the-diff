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


    render() {
        console.log(this.props.data[1])

        return (
            <div className="TopTracks-grid">
            {this.props.data.map((trackObj) => (
                <Card>
                    <div key={trackObj.id} className="TopTracks-div">
                        <img className="TopTracks-image" src={trackObj.album.images[0].url}/>
                        <p className="TopTracks-text">{trackObj.name}</p>
                    </div>
                </Card>
            ))}
            </div>
        );
    }
}

export default TopTracks;