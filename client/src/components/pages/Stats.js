import React, { Component } from "react";
import { get, post } from "../../utilities";

import "../../utilities.css";

import "./Stats.css";

class Stats extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <h1>This is the stats page</h1>
        );
    }
}

export default Stats;