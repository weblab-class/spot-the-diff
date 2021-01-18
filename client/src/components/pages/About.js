import React, { Component } from "react";

import "./About.css";

class About extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <h1 className='u-centertext'>We are a team of three music lovers aiming to revolutionize the Spotify listening experience!</h1>
        );
    }
}

export default About;