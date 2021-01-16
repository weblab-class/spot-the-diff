import React, { Component } from "react";
import { Link } from "@reach/router";
import { get, post } from "../../utilities";

import "./NavBar.css";

class NavBar extends Component {
    constructor(props) {
        super(props);
    }

    getCurrentPlayback = () => {
        console.log('in get current playback');
        get('/api/currentPlayback').then(data => {
            console.log(data);
        }).catch(err => {
            console.log(err);
        });
    }

    render() {
    return (
        <nav className="NavBar-container">
            <p className="NavBar-text NavBar-left">Currently Playing: </p>
            <button onClick={this.getCurrentPlayback}>click for current playback</button>
            <div className="NavBar-right">
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