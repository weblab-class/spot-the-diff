import React, { Component } from "react";
import { get, post } from "../../utilities";

import "../../utilities.css";

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <h1>This is the profile page</h1>
        );
    }
}

export default Profile;