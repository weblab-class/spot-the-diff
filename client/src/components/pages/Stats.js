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
            friendArtists: null,
            friendTracks: null,
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
             this.setState({ friendArtists: data.artists })
        })
    }

    getUserTracks = (userId) => {
        get("/api/user-topTracks", { otherId: userId }).then((data) => {
            console.log("Retrieving friend's favorite tracks...")
            console.log(userId, 'top tracks: ', data.tracks);
            console.log("eyy it worked again!")
            this.setState({ friendTracks: data.tracks })
        })
    }

    render() {
        if (!this.state.topTracks || !this.state.topArtists) {
            return <div> Loading! </div>;
        }
        let compare;
        if (!this.state.friendArtists) {
            compare = (<p>Enter the username of a friend to compare!</p>);
        } else {
            compare = (
                <div className="flex-column">
                    <h2>Friend's Top Tracks</h2>
                    <TopTracks data={this.state.friendTracks} />
                    <h2>Friend's Top Artists</h2>
                    <TopArtists topArtists={this.state.friendArtists} />
                </div>
            )
        }

        return (
            <div>
                <h1>This is the stats page</h1>
                <Form compareArtists={this.getUserArtists} compareTracks={this.getUserTracks} />
                <div className="flex-row">
                    <div className="flex-column">
                        <h2>My Top Tracks</h2>
                        <TopTracks data={this.state.topTracks} />
                        <h2>My Top Artists</h2>
                        <TopArtists topArtists={this.state.topArtists} />
                    </div>
                    {compare}
                </div>
            </div>
        );
    }
}

export default Stats;