import React, { Component } from "react";
import { Link } from "@reach/router";
import { get, post } from "../../utilities";

import "./NavBar.css";

/**
 * Proptypes
 * @param {string} userId
 * @param {string} spotifyId
 * @param {string} myName
 */
class NavBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isPlaying: false,
            currentlyPlaying: undefined,
        };
    }

    getCurrentPlayback = () => {
        console.log('in get current playback');
        get('/api/currentPlayback').then(data => {
            const playback = data.playback;
            console.log(playback);

            if (playback) {
                console.log('playing')
                this.setState({
                    isPlaying: true,
                    currentlyPlaying: playback,
                });
            }
            // not currently playing, i.e. data is null
            else {
                console.log('not playing')
                this.setState({
                    isPlaying: false,
                });
            }
        }).catch(err => {
            console.log(err);
        });
    }

    render() {
        let title;
        // if (!this.state.isPlaying) {
        //     title = 'Start playing a song!';
        // }
        // else {
        //     const currentSong = this.state.currentlyPlaying.item.name;
        //     const currentArtist = this.state.currentlyPlaying.item.artists[0].name;
        //     title = "Currently Playing: " + currentSong + " - " + currentArtist;
        // }

        return (
            <nav className="NavBar-container">
                {this.props.userId ? 
                    <>
                    <p className="NavBar-text-left NavBar-left m-text"> Logged in as: {this.props.myName} [{this.props.spotifyId}] </p>
                    {/* TODO: constantly check for playback without button - with socket? */}
                    {/* <button onClick={this.getCurrentPlayback} className="NavBar-button NavBar-playback">Click for Current Playback</button> */}
                    </> : <></>
                }
                
                <div className="NavBar-right">
                    {this.props.userId ? (
                    <>
                        {/* <Link to="/about" className="NavBar-text-left m-text"> About </Link> */}
                        <Link to="/" className="NavBar-text-left m-text"> home </Link>
                        {/* <Link to={`/profile/${this.props.spotifyId}`} className="NavBar-text-left m-text"> Profile </Link> */}
                        <Link to={`/stats`} className="NavBar-text-left m-text"> my stats </Link>
                        <Link to={`/friends/${this.props.spotifyId}`} className="NavBar-text-left m-text"> my friends </Link>
                    </>
                    ): (
                    <>
                        {/* <Link to="/" className="NavBar-text-loggedout m-text"> home </Link> */}
                        {/* <Link to="/about" className="NavBar-text-loggedout m-text"> About </Link> */}
                    </>
                    )}
                </div>
            </nav>
        );
    }
}

export default NavBar;