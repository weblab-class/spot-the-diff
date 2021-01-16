import React, { Component } from "react";
import { Link } from "@reach/router";
import { get, post } from "../../utilities";

import "./NavBar.css";

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
            console.log(data);

            if (data.data) {
                console.log('playing')
                this.setState({
                    isPlaying: true,
                    currentlyPlaying: data.data,
                });
            }
            // not currently playing, i.e. data.data is null
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
        let currentSong = this.state.isPlaying ? this.state.currentlyPlaying.item.name : 'start playing a song!';

        return (
            <nav className="NavBar-container">
                <p className="NavBar-text NavBar-left">Currently Playing: </p>
                <p className="NavBar-text NavBar-left">{currentSong}</p>
                {/* TODO: constantly check for playback without button - with socket? */}
                <button onClick={this.getCurrentPlayback}>click for current playback</button>
                <div className="NavBar-right">
                    <Link to="/" className="NavBar-text"> Login </Link>
                    <Link to="/home" className="NavBar-text"> Home </Link>
                    <Link to="/profile" className="NavBar-text"> Profile </Link>
                    <Link to="/stats" className="NavBar-text"> Stats </Link>
                    <Link to="/about" className="NavBar-text"> About </Link>
                </div>
            </nav>
        );
    }
}

export default NavBar;