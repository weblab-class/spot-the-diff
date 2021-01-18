import React, { Component } from "react";
import { get, post } from "../../utilities";


import "../../utilities.css";
import "./Login.css";

/**
 * Proptypes
 * @param {string} userId
 * @param {() => ()} handleLogin
 * @param {() => ()} handleLogout
 */
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
        console.log(data);
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
                    {this.props.userId ? 
                      <>
                      <h1 className='u-textCenter'>checkout your listening info below!</h1>
                      <button onClick={this.fetchPlaylists}>Fetch playlists</button>
                      <button onClick={this.fetchRecent}>Fetch recent</button>
                      <button onClick={this.getMe}>getMe</button>
                      <button onClick={this.props.handleLogout}>logout here</button>
                      </> :
                      <>
                      <h1 className='u-textCenter'>welcome! login to spotify below to get started.</h1>
                      <button onClick={this.props.handleLogin}>login here</button> </>}
                    {this.props.userId ? <div>check your console log and explore the object there for user {this.props.userId}</div> : <div></div>}
                </div>
            </>
        );
    }
}

export default Login;