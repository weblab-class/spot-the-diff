import React, { Component } from "react";
import { get, post } from "../../utilities";


import "../../utilities.css";
import "./Login.css";

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: undefined,
        };
    }

    handleLogin = () => {
        get("/api/spotify-login").then((data) => {
          console.log(data.url);
          window.location.href = data.url;
        })
      }  
    
      fetchPlaylists = () => {
        get("/api/playlists").then((data) => {
          console.log(data);
        })
      }

      fetchRecent = () => {
        console.log("fetching recent");
        get("/api/recent").then((data) => {
          console.log(data);
        })
      }
    
    render() {
        return (
            <div>
                <h1>welcome! login to spotify to get started.</h1>
                <h3>or, learn more about us first.</h3>
                <button onClick={this.handleLogin}>Login here pls</button>
                <button onClick={this.fetchPlaylists}>Fetch playlists</button>
                <button onClick={this.fetchRecent}>Fetch recent</button>
            </div>
        );
    }
}

export default Login;