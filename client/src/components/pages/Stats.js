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
            otherId: '',
            friendArtists: null,
            friendTracks: null,
            compatibility: undefined,
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

    handleCompare = () => {
        const intersect = (arrA, arrB) => {
            return arrA.filter(x => arrB.some(y => y.id === x.id));
        }
        const tracksA = this.state.topTracks;
        const tracksB = this.state.friendTracks;
        const artistsA = this.state.topArtists;
        const artistsB = this.state.friendArtists;

        const commonTracks = intersect(tracksA, tracksB);
        const commonArtists = intersect(artistsA, artistsB);

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

    render() {
        if (!this.props.spotifyId) return <div>Log in before accessing Stats</div>;

        if (!this.state.topTracks || !this.state.topArtists) {
            return <div> Loading! </div>;
        }
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

        return (
            <div>
                <h1 className='u-centertext .xl-text'>Custom Listening Insights</h1>

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
                <div className="flex-row">
                    <div className="flex-column">
                        <h2 className='u-centertext'>My Top Tracks</h2>
                        <TopTracks data={this.state.topTracks}/>
                        <h2 className='u-centertext'>My Top Artists</h2>
                        <TopArtists topArtists={this.state.topArtists} />
                    </div>
                    {compare}
                </div>
            </div>
        );
    }
}

export default Stats;