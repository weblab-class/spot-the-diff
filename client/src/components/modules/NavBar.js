import React, { Component } from "react";
import { Link } from "@reach/router";

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
                <Link to="/" className="NavBar-text"> Home </Link>
                <Link to="/" className="NavBar-text"> Stats </Link>
                <Link to="/" className="NavBar-text"> About </Link>
            </div>
        </nav>
    );
    }
    }

export default NavBar;