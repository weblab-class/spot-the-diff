import React, { Component } from "react";

import "./NavBar.css";

class NavBar extends Component {
    constructor(props) {
    super(props);
    }

    render() {
    return (
        <nav className="NavBar-container">
            <p className="NavBar-text NavBar-left">Currently Playing: </p>
            <div className="NavBar-right">
                <p className="NavBar-text">Home</p>
                <p className="NavBar-text">Stats</p>
                <p className="NavBar-text">About</p>
            </div>
        </nav>
    );
    }
    }

export default NavBar;