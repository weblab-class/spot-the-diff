import React, { Component } from "react";
import { get, post } from "../../utilities";


import "../../utilities.css";
import "./Home.css";

/**
 * Proptypes
 * @param {string} userId
 * @param {string} spotifyId (like username)
 * @param {() => ()} handleLogin
 * @param {() => ()} handleLogout
 */
class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
          spotifyId: undefined,
        };
    }

    
    componentDidMount() {
      // api calls
      // get("/api/getMe").then((data) => {
      //   console.log('here');
      //   console.log(data);
      //   this.setState({
      //     spotifyId: data.id,
      //   })
      // });
    }

    // these are for testing purposes
    getMe = () => {
      get("/api/getMe").then((data) => {
        console.log('in getMe, user data: ', data);
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
                  <h1 className='u-centertext xl-text'>welcome to Spot the Diff!</h1>
                  {this.props.userId ? 
                    <>
                    {/* <h1 className='u-centertext l-text'>checkout your listening info below!</h1>
                    <button onClick={this.fetchPlaylists}>Fetch playlists</button>
                    <button onClick={this.fetchRecent}>Fetch recent</button> */}
                    <button onClick={this.getMe} className="Login-button"><b>Get Me</b></button>
                    <button onClick={this.props.handleLogout} className="Logout-button"><b>Logout</b></button> 
                    <h2> your spotify ID is: {this.props.spotifyId}</h2></> :
                    <>
                    <h2> login to spotify below to get started</h2>
                    <button onClick={this.props.handleLogin} className="Login-button"><b>Login</b></button> </>}
                    <h2 className='l-text Home-text'>Spot the Diff was founded by a team of three music lovers aiming to revolutionize the Spotify listening experience!</h2>
                    {/* {this.props.userId ? <div>check your console log and explore the object there for user {this.props.userId}</div> : <div></div>} */}
                </div>
            </>
        );
    }
}

export default Login;