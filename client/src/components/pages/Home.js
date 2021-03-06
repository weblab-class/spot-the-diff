import React, { Component } from "react";
import { get, post } from "../../utilities";
import HomeLogo from '../images/home-page.svg';


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
                  <div className="Home-section1">
                    <img src={HomeLogo} className="Home-image" alt="Home Logo" />
                  </div>
                  <div className="Home-section2">
                    <h1 className='Home-title'>Spot<span className="Home-spotify-label">(ify)</span> the Diff!</h1>
                    <i className='Home-pitch'>Founded by a team of three music lovers aiming to revolutionize the Spotify social experience.</i>
                    <ul className='Home-pitch'>
                    {/* ➡ */}
                      <p>✨ Gain custom insights into your Spotify listening trends.</p>
                      <p>✨ Compare your music history with your friends.</p>
                      <p>✨ Generate playlists based on you and your friends' shared tastes.</p>
                    </ul>
                    {this.props.userId ? 
                      <>
                      {/* <h1 className='u-centertext l-text'>checkout your listening info below!</h1>
                      <button onClick={this.fetchPlaylists}>Fetch playlists</button>
                      <button onClick={this.fetchRecent}>Fetch recent</button> */}
                      {/* <button onClick={this.getMe} className="Login-button"><b>Get Me</b></button> */}
                      {/* <h2 className="Home-text">Your Spotify ID: {this.props.spotifyId}</h2> */}
                      <h2 className = "Home-text" > Happy Listening! </h2>
                      <button onClick={this.props.handleLogout} className="Home-button"><b>Logout</b></button></> :
                      <>
                      <h2 className = "Home-text">Login to Spotify below to get started. Happy listening!</h2>
                      <button onClick={this.props.handleLogin} className="Home-button"><b>Login</b></button> </>}
                      {/* {this.props.userId ? <div>check your console log and explore the object there for user {this.props.userId}</div> : <div></div>} */}
                  </div>
                </div>
            </>
        );
    }
}

export default Login;