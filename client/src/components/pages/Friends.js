import React, { Component } from "react";
import { get, post } from "../../utilities";

import "../../utilities.css";
import TopTracks from "../modules/TopTracks";
import TopArtists from "../modules/TopArtists";
import Card from "../modules/Card";
import Form from "../modules/Form"
import Instructions from "../modules/Instructions";

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
        this._isMounted = false;
        this.state = {
            // can test with 'krishnahibye' or 'helen_hu'
            otherId: null,
            friendName: null,
            friendArtists: null,
            friendTracks: null,
            compatibility: undefined,
            compatibilityMessage: undefined,
            commonTracks: [],
            commonArtists: [],
            commonGenres: [],
            genreSeeds: [],
            playlistTracks: undefined,
            friends: [],
            playlistId: '',
        };
    }

    componentDidMount() {
        this._isMounted = true;
        get("/api/genreSeeds").then((data) => {
            console.log(data);
            this._isMounted && this.setState({
                genreSeeds: data.genres,
            })
        })
    }
    componentWillUnmount() {
        this._isMounted = false;
    }

    getUserArtists = (userId) => {
        get("/api/user-topArtists", { otherId: userId }).then((data) => {
            console.log("Retrieving friend's favorite artists...")
            console.log(userId, 'top artists: ', data.artists);
            console.log("eyy it worked!")
            this._isMounted && this.setState({ friendArtists: data.artists })
        })
    }

    getUserTracks = (userId) => {
        get("/api/user-topTracks", { otherId: userId }).then((data) => {
            console.log("Retrieving friend's favorite tracks...")
            console.log(userId, 'top tracks: ', data.tracks);
            console.log("eyy it worked again!")
            this._isMounted && this.setState({ friendTracks: data.tracks })
        })
    }

    addRating = (score) => {
        console.log("in addRating function")
        console.log(this.state.otherId, this.state.friendName, score);
        post("/api/addRating", { userId: this.state.otherId, friendName: this.state.friendName, rating: score }).catch(err => {
            console.log('error in addRating in Friends.js', err);
        })
    }

    updateSelectedFriend = (userId) => {
        get("/api/getUser", {userId}).then((data) => {
            console.log(data);
            this._isMounted && this.setState({ 
                otherId: userId,
                friendName: data.display_name,

            });
        }).then(() => {
            this.handleCompare();
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
        let tracksB = this.state.friendTracks;
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

        // console.log('common tracks: ', commonTracks);
        // console.log('common artists: ', commonArtists);
        // console.log('common genres: ', commonGenres);
        // console.log('common track albums: ', commonTrackAlbums);
        // console.log('common track artists: ', commonTrackArtists);

        // console.log(tracksB);
        for (let track of tracksB) {
            if (commonTracks.some(t => t.id === track.id)) {
                track.isCommon = true;
                // console.log(track)
            }
        }
        console.log(tracksB);

        for (let artist of artistsB) {
            if (commonArtists.some(a => a.id === artist.id)) {
                artist.isCommon = true;
                // console.log(track)
            }
        }
        console.log(artistsB);

        const tracks_pts = 100 * 2*commonTracks.length / totalTracks;
        const artists_pts = 100 * 2*commonArtists.length / (artistsA + artistsB);

        let total_pts = 1 * 100*2*commonTracks.length/totalTracks
                        + 1 * 100*2*commonArtists.length/totalArtists
                        + 4 * commonTrackAlbums.length 
                        + 3 * commonTrackArtists.length
                        + 2 * commonGenres.length;
        
        if (total_pts >= 100)
        {
            total_pts = 100;
        }

        let message;

        if (total_pts === 100)
        {
            message = "hot diggity dog! almost like you two are the same person... 👀"
        }
        else if (total_pts >= 75)
        {
            message = "You two are destined to be together for life. "
        }
        else if (total_pts >= 50)
        {
            message = "Solid above average. ";
        }
        else if (total_pts >= 35)
        {
            message = "opposites attract?";
        }
        else if (total_pts >= 10) {
            message = "";
        }
        else {
            message = "...this may be a sign that you're not meant to be. \
            Take this as a long-awaited opportunity to cut off that toxic friend... or not. \
            Maybe you two get along perfectly fine. But one thing's for sure: stay away from the topic of music if you don't want to start a fight!";
        }

        // console.log(total_pts);
        this.setState({
            compatibility: total_pts.toFixed(2),
            compatibilityMessage:message,
            commonTracks: commonTracks,
            commonArtists: commonArtists,
            commonGenres: commonGenres,
            playlistTracks: undefined,
            friendTracks: tracksB,
            friendArtists: artistsB,
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
            this._isMounted && this.setState({
                playlistTracks: tracks,
            }, (() => {
                console.log('set tracks state to', this.state.playlistTracks);
            }))
        })
    }

    makePlaylist = () => {
        // if user wants to create playlist
        get("/api/createPlaylist", {friendName: this.state.friendName, score: this.state.compatibility}).then(playlist => {
            console.log('my new playlist: ', playlist)
            let tracks = this.state.playlistTracks;
            tracks = JSON.stringify(tracks.map(x => x.uri));
            // console.log(tracks);
            get("/api/addToPlaylist", {playlistId: playlist.id, tracks: tracks}).then(newPlaylist => {
                console.log("my new filled playlist: ", newPlaylist)
            })
            this._isMounted && this.setState({
                playlistId: playlist.id,
            })
            console.log('url for your playlist: https://open.spotify.com/playlist/' + playlist.id);
            const playlistUrl = 'https://open.spotify.com/playlist/' + playlist.id;
            window.open(playlistUrl, '_blank');
        })
    }

    getFriendList = () => {
        get("/api/friendRanking").then(list => {
            this._isMounted && this.setState({ friends: list })
        }).catch(err => {
            console.log(err);
        })
    }

    displayFriends = () => {
        // console.log(this.state.friends)
        let display;
        try{
             display = this.state.friends.map((friendObj) => (
                <div key={friendObj._id}>
                    <div><b>{friendObj.friendName}</b> [{friendObj.userId}] | <b>{friendObj.rating}</b></div> 
                </div>
            ))    
        }
        catch (TypeError) {
            display = null;
        }
        return display
    }

    render() {
        if (!this.props.userId) return <div>Log in before accessing Stats</div>;

        let friendName;
        let apostrophe;
        if (!this.state.friendName) {
            friendName = "your friend";
            apostrophe="";
        }
        else {
            friendName = <span style={{color: '#1DB954' }}>{this.state.friendName}</span>;
            apostrophe = <span style={{color:'#1DB954'}}>'s</span>
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
                        <h2>{friendName}{apostrophe} Top Tracks</h2>
                        <TopTracks data={this.state.friendTracks} />
                        <h2>{friendName}{apostrophe} Top Artists</h2>
                        <TopArtists topArtists={this.state.friendArtists} />
                    </div>
                </>
            )
        }

        this.getFriendList();

        return (
            <div className="Friends-page">
            <div className="Friends-leftSide">

            {this.state.playlistTracks ?
            <>
                <h3>here's the playlist we made for you! click the button again to refresh the tracklist. we won't get offended ;)</h3>
                <button className="Friend-button" onClick={this.makePlaylist}>save and open in spotify!</button>
                <TopTracks data={this.state.playlistTracks} />
            </> : <></>}
            

            {isComparing ? 
            <>
                <h3>your compatibility with {friendName} is: {this.state.compatibility}%. {this.state.compatibilityMessage}</h3> 
                <button className ="Friend-button" onClick={this.getPlaylist}>get a custom playlist that both you and {friendName} would like!</button>
                </> : <></>
            }

            {this._isMounted ?
            <>
            <div className="Friends-forms">
                <Form compareArtists={this.getUserArtists} compareTracks={this.getUserTracks} pickFriend={this.updateSelectedFriend} className="Friends-form" /> 
                <Instructions/>
            </div>
            {compare} 
            </> : <></>
            }
            </div>
            <div className="Friends-rightSide">
                <h2 className="Friends-emphasized-text">Friend List</h2>
                <div className="Friends-text">{this.displayFriends()}</div>
                <h2 className="Friends-emphasized-text">About Compatibility</h2>
                <div className="Friends-text">Compatibility quanitifies you and your friends' shared music taste, as measured by Spot-the-diff's algorithm</div>
            </div>
            </div>
        )
    }
}

export default Friends;
    

