import React, { Component } from "react";

import "./TopTracks.css";

class TopTracks extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }


    render() {
        // console.log(this.props.data[1])

        return (
            <>
                {this.props.data.map((title, i) => (
                        <div>
                            <p>{title.name}</p>
                            <img src={title.image}/>
                        </div>
                ))}
            </>
        );
    }
}

export default TopTracks;