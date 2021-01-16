import React, { Component } from "react";
import { get, post } from "../../utilities";

import "../../utilities.css";

import "./Stats.css";

class Stats extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    fetchTopTracks = () => {
        console.log("fetching top tracks");
        get("/api/topTracks").then((data) => {
            console.log(data);
        }) 
        
    }

    render() {
        return (
            <div>
                <h1>This is the stats page</h1>
                <button onClick={this.fetchTopTracks}>Fetch top tracks</button>
            </div>
        );
    }
}

export default Stats;