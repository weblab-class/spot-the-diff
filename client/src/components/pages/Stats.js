import React, { Component } from "react";
import { get, post } from "../../utilities";

import "../../utilities.css";

import "./Stats.css";

class Stats extends Component {
    constructor(props) {
        super(props);
        this.state = {
            topTracks: [],
        };
    }

    fetchTopTracks = () => {
        console.log("fetching top tracks");
        get("/api/topTracks").then((data) => {
            console.log(data);
            let topTitles = data.map(song => song.name);
            console.log("next")
            console.log(topTitles)
            this.setState( { topTracks: topTitles})
        }) 

    }

    render() {
        return (
            <div>
                <h1>This is the stats page</h1>
                <button onClick={this.fetchTopTracks}>Fetch top tracks</button>
                {this.state.topTracks.map((song) => (
                    <p>{song}</p>
                ))}
            </div>
        );
    }
}

export default Stats;