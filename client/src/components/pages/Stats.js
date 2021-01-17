import React, { Component } from "react";
import { get, post } from "../../utilities";

import "../../utilities.css";
import TopTracks from "../modules/TopTracks";

import "./Stats.css";

class Stats extends Component {
    constructor(props) {
        super(props);
        this.state = {
            topTracks: [],
        };
    }

    componentDidMount() {
        console.log("fetching top tracks");
        get("/api/topTracks").then((data) => {
            let topTitles = [];
            data.forEach(function (item, i) {
                let title = {
                    name: item.name,
                    image: item.album.images[0].url,
                }
                topTitles.push(title)
            });
            console.log(topTitles)
            this.setState( { topTracks: topTitles})
        }) 
    }

    render() {
        return (
            <div>
                <h1>This is the stats page</h1>
                <TopTracks data={this.state.topTracks} />
            </div>
        );
    }
}

export default Stats;