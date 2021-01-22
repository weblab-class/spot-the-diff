import React, { Component } from "react";
import { get, post } from "../../utilities";

import "../../utilities.css";
import TopTracks from "../modules/TopTracks";
import TopArtists from "../modules/TopArtists";
import Card from "../modules/Card";
import Form from "../modules/Form"

import "./Friends.css";

class Friends extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // can test with 'krishnahibye' or 'helen_hu'
            otherId: '',
            friendArtists: null,
            friendTracks: null,
            compatibility: undefined,
        };
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
    intersect = (arrA, arrB) => {
        // returns the elements in both arrays
        return arrA.filter(eleA => arrB.some(eleB => eleB.id === eleA.id));
    }

    handleCompare = () => {
        const tracksA = this.props.topTracks;
        const tracksB = this.state.friendTracks;
        const artistsA = this.props.topArtists;
        const artistsB = this.state.friendArtists;

        const commonTracks = this.intersect(tracksA, tracksB);
        const commonArtists = this.intersect(artistsA, artistsB);

        console.log('common tracks: ', commonTracks);
        console.log('common artists: ', commonArtists);

        const tracks_pts = 2*commonTracks.length / (tracksA.length + tracksB.length);
        const artists_pts = 2*commonArtists.length / (artistsA.length + artistsB.length);

        const total_pts = 100 * (tracks_pts + artists_pts)/2;

        console.log(total_pts);
        this.setState({
            compatibility: total_pts,
        });
    }

    render(){
        let compare;
        let isComparing = false;
        if (!this.state.friendArtists) {
            // compare = (<span className="Stats-left">Enter the username of a friend to compare!</span>);
            compare = <div></div>;
        } else {
            isComparing = true;
            compare = (
                <>
                    <div className="flex-column">
                        <h2>Friend's Top Tracks</h2>
                        <TopTracks data={this.state.friendTracks} />
                        <h2>Friend's Top Artists</h2>
                        <TopArtists topArtists={this.state.friendArtists} />
                    </div>
                </>
            )
        }
        return(
            <div>
            {isComparing ? 
                <>
                <button onClick={this.handleCompare}>get compatibility!</button>
                <h3>your compatibility with your friend is: {this.state.compatibility}%</h3> </> :
                <></> }
            <h3>To compare your stats with your friends...</h3>
            <ul>
                <li>make sure they've logged into our website before</li>
                <li>your spotify ID can be found on the home page, right under the logout button!</li>
                <li style={{color: '#87CBD4' }}>no friends yet? no worries, we'll be your friend! try putting in this ID: llr5ecqygx3g5iqkx9lfnqzmt</li>
            </ul>
            <Form compareArtists={this.getUserArtists} compareTracks={this.getUserTracks} />
                {compare}
            </div>
        )
    }
}

export default Friends;
    

