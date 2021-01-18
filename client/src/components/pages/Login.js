import React, { Component } from "react";
import { get, post } from "../../utilities";


import "../../utilities.css";
import "./Login.css";

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    
    componentDidMount() {
      // api calls
    }

    getMe = () => {
      get("/api/getMe").then((data) => {
        console.log('here');
        console.log(data.body);
      });
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
            <>
                <div className='Login-container'>
                    <h1 className='u-textCenter'>welcome! login to spotify to get started.</h1>
                    <h3 className='u-textCenter'>or, learn more about us first.</h3>
                    <button onClick={this.fetchPlaylists}>Fetch playlists</button>
                    <button onClick={this.fetchRecent}>Fetch recent</button>
                    <button onClick={this.getMe}>getMe</button>

                    {this.props.userId ? <div>check your console log and explore the object there for user {this.props.userId}</div> : <div></div>}
                    {this.props.userId ? 
                      <button onClick={this.props.handleLogout}>logout</button> :
                      <button onClick={this.props.handleLogin}>login</button>}
                </div>
            </>
        );
    }
}

export default Login;