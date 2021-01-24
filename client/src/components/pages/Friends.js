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
            otherId: null,
            friendName: null,
            friendArtists: null,
            friendTracks: null,
            compatibility: undefined,
            commonTracks: [],
            commonArtists: [],
            commonGenres: [],
            genreSeeds: [],
            playlistTracks: undefined,
            friends: [],
        };
    }

    componentDidMount() {
        get("/api/genreSeeds").then((data) => {
            console.log(data);
            this.setState({
                genreSeeds: data.genres,
            })
        })
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

    addRating = (score) => {
        console.log("in addRating function")
        post("/api/addRating", { userId: this.state.otherId, rating: score })
    }

    updateSelectedFriend = (userId) => {
        get("/api/getUser", {userId}).then((data) => {
            console.log(data);
            this.setState({ 
                otherId: userId,
                friendName: data.display_name,
            });
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

        // console.log(total_pts);
        this.setState({
            compatibility: total_pts.toFixed(2),
            commonTracks: commonTracks,
            commonArtists: commonArtists,
            commonGenres: commonGenres,
        });

        this.addRating(total_pts.toFixed(2));
    }

    getPlaylist = () => {
        let seedGenres = this.state.commonGenres.filter(x => this.state.genreSeeds.includes(x));
        let seedTracks = this.state.commonTracks.map(x => x.id);
        let seedArtists = this.state.commonArtists.map(x => x.id);

        // cap genres at one
        while (seedGenres.length > 1) {
            seedGenres.splice(Math.floor(Math.random()*seedGenres.length), 1);
        }

        while (seedGenres.length + seedTracks.length + seedArtists.length > 5) {
            // do some processing
            if (seedGenres.length > 0) {
                // seedGenres.pop();
                seedGenres.splice(Math.floor(Math.random()*seedGenres.length), 1);
            }
            else if (seedArtists.length > 2) {
                // seedArtists.pop();
                seedArtists.splice(Math.floor(Math.random()*seedArtists.length), 1);
            }
            else if (seedTracks.length > 3) {
                // seedTracks.pop();
                seedTracks.splice(Math.floor(Math.random()*seedTracks.length), 1);
            }
            
        }
        const seed = {
            seedTracks: seedTracks, // 2
            seedArtists: seedArtists, // 2
            seedGenres: seedGenres, // 1
        }
        console.log(seed);
        get("/api/recommendations", seed).then(data => {
            let tracks = data.tracks;
            this.setState({
                playlistTracks: tracks,
            }, (() => {
                console.log('set tracks state to', this.state.playlistTracks);
            }))
        })
    }

    makePlaylist = () => {
        // if user wants to create playlist
        get("/api/createPlaylist", {friendName: this.state.friendName, score: this.state.compatibility}).then(playlist => {
            // console.log('my new playlist: ', playlist)
            let tracks = this.state.playlistTracks;
            tracks = JSON.stringify(tracks.map(x => x.uri));
            // console.log(tracks);
            get("/api/addToPlaylist", {playlistId: playlist.id, tracks: tracks}).then(newPlaylist => {
                console.log("my new filled playlist: ", newPlaylist)
            })
        })
    }

    getFriendList = () => {
        get("/api/friendRanking").then(list => {
            this.setState({ friends: list })
        })
    }

    displayFriends = () => {
        let display = this.state.friends.map((friendObj) => (
            <div key={friendObj._id}>
                <p><b>{friendObj.userId}</b> {friendObj.rating}</p>
            </div>
        ))
        return display
    }

    render() {
        if (!this.props.userId) return <div>Log in before accessing Stats</div>;

        let friendName;
        if (!this.state.friendName) {
            friendName = "your friend";
        }
        else {
            friendName = <span style={{color: '#B7E1CD' }}>{this.state.friendName}</span>;
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
                        <h2>{friendName}'s Top Tracks</h2>
                        <TopTracks data={this.state.friendTracks} />
                        <h2>{friendName}'s Top Artists</h2>
                        <TopArtists topArtists={this.state.friendArtists} />
                    </div>
                </>
            )
        }

        this.getFriendList();

        return(
            <div className="Friends-page">
            <div className="Friends-leftSide">
            {isComparing ? 
            <>
                <button onClick={this.handleCompare}>get compatibility!</button>
                <button onClick={this.getPlaylist}>get a custom playlist that both you and {friendName} would like!</button>
                <h3>your compatibility with {friendName} is: {this.state.compatibility}%</h3> </> :
            <></> }

            {this.state.playlistTracks ?
            <>
                <h3>here's the playlist we made for you! click the button again to refresh the tracklist. we won't get offended ;)</h3>
                <button onClick={this.makePlaylist}>click here to save this to your spotify!</button>
                <TopTracks data={this.state.playlistTracks} />
            </> : <></>}

            <h3>To compare your stats with your friends...</h3>
            <ul>
                <li>make sure they've logged into our website before</li>
                <li>your spotify ID can be found on the home page, right under the logout button!</li>
                <li style={{color: '#87CBD4' }}>no friends yet? no worries, we'll be your friend! try putting in this ID: llr5ecqygx3g5iqkx9lfnqzmt</li>
            </ul>
            <Form compareArtists={this.getUserArtists} compareTracks={this.getUserTracks} pickFriend={this.updateSelectedFriend} />
            {compare}
            </div>
            <div className="Friends-rightSide">
                <h2>Friends</h2>
                <div>{this.displayFriends()}</div>
            </div>
            </div>
        )
    }
}

export default Friends;
    
