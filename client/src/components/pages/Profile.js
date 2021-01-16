import React, { Component } from "react";
import { get, post } from "../../utilities";

import "../../utilities.css";
import "./Profile.css";

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            playlists: [],
        };
    }

    componentDidMount() {
        get("/api/playlists").then((data) => {
            console.log(data.items);
            let newPlaylists = data.items;
            this.setState((prevState) => ({
                playlists: prevState.playlists.concat(newPlaylists)
            }));
        })
    }

    render() {


        return (
            <>
                <h1>This is the profile page</h1>
                <div>
                    {JSON.stringify(this.state.playlists)}
                </div>
            </>
        );
    }
}

export default Profile;