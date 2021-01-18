import React, { Component } from "react";
import { get, post } from "../../utilities";

import "../../utilities.css";
import "./Profile.css";

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: undefined,
                // my user object, for reference
                // country: "US"
                // display_name: "helen"
                // email: "helenhu.pa@gmail.com"
                // explicit_content: {filter_enabled: false, filter_locked: false}
                // external_urls: {spotify: "https://open.spotify.com/user/helen_hu"}
                // followers: {href: null, total: 29}
                // href: "https://api.spotify.com/v1/users/helen_hu"
                // id: "helen_hu"
                // images: Array(1)
                // product: "premium"
                // type: "user"
                // uri: "spotify:user:helen_hu"
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
        });
        document.title = "Profile Page";
        // <div>"Your Home Page!"</div>

        get("/api/getMe").then((data) => {
            console.log(data);
            this.setState({
                user: data,
            })
        });
    }

    render() {
        if (!this.state.user) {
            return <div> Loading! </div>;
        }
        const username = this.state.user.display_name;
        const userIcon = this.state.user.images[0].url;

        return (
            <>
                <div className="Profile-container">
                    <h1>This is the profile page</h1>
                    <h2>hi, {username}!</h2>
                    <img src={userIcon} />
                </div>
                <div>
                    <h2>Your playlists look good</h2>
                </div>
            </>
        );
    }
}

export default Profile;