import React, { Component } from "react";
import { get, post } from "../../utilities";

import "../../utilities.css";
import "./Profile.css";

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: undefined,
            playlists: [],
        };
    }

    componentDidMount() {
        get("/api/playlists").then((data) => {
            // console.log(data.items);
            let newPlaylists = data.items;
            this.setState((prevState) => ({
                playlists: prevState.playlists.concat(newPlaylists)
            }));
        })
        document.title = "Profile Page";
        <div>"Your Home Page!"</div>
        get("/api/getMe").then(console.log("yolo"));
        // get(`/api/whoami`, { userid: this.props.body }).then((user) => this.setState({ user: user }));

    }

    render() {


        return (
            <>
                <h1>This is the profile page</h1>
                <div>
                    {console.log("hello")};
                </div>
            </>
        );
    }
}

export default Profile;