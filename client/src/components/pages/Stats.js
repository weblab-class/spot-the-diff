import React, { Component } from "react";
import { get, post } from "../../utilities";

import "../../utilities.css";
import TopTracks from "../modules/TopTracks";
import TopArtists from "../modules/TopArtists";
import Card from "../modules/Card";
import Form from "../modules/Form"

import "./Stats.css";

class Stats extends Component {
    constructor(props) {
        super(props);
        this.state = {
            topTracks: [],
            topArtists: [],
            // can test with 'krishnahibye' or 'helen_hu'
            otherId: 'krishnahibye',
            friendArtists: [],
        };
    }

    componentDidMount() {
        get("/api/topTracks").then((data) => {
            console.log('my top tracks: ', data);
            this.setState({ 
                topTracks: data, 
            });
        });

        get("/api/topArtists").then((data) => {
            console.log('my top artists: ', data);
            this.setState({
                topArtists: data,
            })
        }); 
    }

    getUserArtists = (userId) => {
        get("/api/user-topArtists", { otherId: userId }).then((data) => {
            console.log("Retrieving friend's favorite artists...")
            console.log(userId, 'top artists: ', data.artists);
            console.log("eyy it worked!")
        })
    }

    getUserTracks = (userId) => {
        get("/api/user-topTracks", { otherId: userId }).then((data) => {
            console.log("Retrieving friend's favorite tracks...")
            console.log(userId, 'top tracks: ', data.tracks);
            console.log("eyy it worked again!")
        })
    }

    render() {
        if (!this.state.topTracks || !this.state.topArtists) {
            return <div> Loading! </div>;
        }
        return (
            <>
            <div>
                <h1>This is the stats page</h1>
                <Form compareArtists={this.getUserArtists} compareTracks={this.getUserTracks} />
                <Card>
                    <TopTracks data={this.state.topTracks} />
                </Card> 
            </div>
            <div>
                <TopArtists topArtists={this.state.topArtists} />
            </div>
            </>
        );
    }
}

export default Stats;