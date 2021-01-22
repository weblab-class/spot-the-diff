import React, { Component } from "react";
import { get, post } from "../../utilities";

import "../../utilities.css";
import TopTracks from "../modules/TopTracks";
import TopArtists from "../modules/TopArtists";
import Card from "../modules/Card";
import Form from "../modules/Form"

import "./Friends.css";

/**
 * Proptypes
 * @param {String} userId
 * @param {array} topTracks
 * @param {array} topArtists
 * @param {function} getArtistGenres
 * @param {function} getTrackAlbums
 * @param {function} getTrackArtists
 */
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
    intersect_id = (arrA, arrB) => {
        // returns the elements with same ids
        return arrA.filter(eleA => arrB.some(eleB => eleB.id === eleA.id));
    }

    intersect = (arrA, arrB) => {
        // returns the elements in both arrays
        return arrA.filter(eleA => arrB.some(eleB => eleB === eleA));
    }

    handleCompare = () => {
        const tracksA = this.props.topTracks;
        const tracksB = this.state.friendTracks;
        const totalTracks = tracksA.length + tracksB.length;

        const artistsA = this.props.topArtists;
        const artistsB = this.state.friendArtists;
        const totalArtists = artistsA.length + artistsB.length;

        const genresA = this.props.getArtistGenres(artistsA);
        const genresB = this.props.getArtistGenres(artistsB);

        const commonTracks = this.intersect_id(tracksA, tracksB);
        const commonArtists = this.intersect_id(artistsA, artistsB);
        const commonGenres = this.intersect(genresA, genresB);
        const commonTrackAlbums = this.intersect(this.props.getTrackAlbums(tracksA), this.props.getTrackAlbums(tracksB));
        const commonTrackArtists = this.intersect(this.props.getTrackArtists(tracksA), this.props.getTrackArtists(tracksB));

        console.log('common tracks: ', commonTracks);
        console.log('common artists: ', commonArtists);
        console.log('common genres: ', commonGenres);
        console.log('common track albums: ', commonTrackAlbums);
        console.log('common track artists: ', commonTrackArtists);

        const tracks_pts = 100 * 2*commonTracks.length / totalTracks;
        const artists_pts = 100 * 2*commonArtists.length / (artistsA + artistsB);

        const total_pts = 1 * 100*2*commonTracks.length/totalTracks
                        + 1 * 100*2*commonArtists.length/totalArtists
                        + 4 * commonTrackAlbums.length 
                        + 3 * commonTrackArtists.length
                        + 2 * commonGenres.length;

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
    

