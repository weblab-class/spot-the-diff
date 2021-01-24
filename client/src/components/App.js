import React, { Component } from "react";
import { Router } from "@reach/router";
import NotFound from "./pages/NotFound.js";
import Home from "./pages/Home.js";
import NavBar from "./modules/NavBar.js";
import Profile from "./pages/Profile.js"
import Stats from "./pages/Stats.js"
import Friends from "./pages/Friends.js"

import "../utilities.css";
import "./App.css";

import { socket } from "../client-socket.js";

import { get, post } from "../utilities";

/**
 * Define the "App" component as a class.
 */
class App extends Component {
  // makes props available in this component
  constructor(props) {
    super(props);
    this.state = {
      userId: undefined,
      spotifyId: undefined,
      topTracks: undefined,
      topArtists: undefined,
    };
  }

  componentDidMount() {
    console.log('in App componentDidMount');
    // get("/api/callback").then(() => {
    //   console.log('get request to /api/callback');
    // });

    get("/api/whoami").then((user) => {
      console.log('in whoami; user data is', user);
      if (user._id) {
        // they are registed in the database, and currently logged in.
        console.log('user id is', user._id);
        console.log('spotify id is: ', user.spotifyId);
        this.setState({ 
          userId: user._id,
          spotifyId: user.spotifyId,
        });
      }
    });

    const timeRanges = ['short_term', 'medium_term', 'long_term'];
    for (const timeRange of timeRanges) {
      get("/api/topTracks", {timeRange: timeRange}).then((data) => {
        console.log('my top tracks: ', data);
        this.setState({ 
            topTracks: data, 
        });
      }).catch((err) => {
        console.log(err);
      });
    }

    get("/api/topArtists").then((data) => {
      console.log('my top artists: ', data);
      this.setState({
          topArtists: data,
      });
    }).catch((err) => {
      console.log(err);
    }); 
    
  }

  // handleLogin = (res) => {
  //   console.log(`Logged in as ${res.profileObj.name}`);
  //   const userToken = res.tokenObj.id_token;
  //   post("/api/login", { token: userToken }).then((user) => {
  //     this.setState({ userId: user._id });
  //     post("/api/initsocket", { socketid: socket.id });
  //   });
  // };

  handleLogin = () => {
    console.log("Logging in")
    get("/api/spotify-login").then((data) => {
      console.log(data.url);
      window.location.href = data.url;
    })
  }  

  handleLogout = () => {
    this.setState({ userId: undefined });
    console.log("logging out");
    post("/api/logout");
  };

  getArtistGenres = (artistList) => {
    let artistGenres = []
    artistList.forEach(artist => {
        artist.genres.forEach(genre => {
            if (!artistGenres.includes(genre)) {
                artistGenres.push(genre);
            }
        })
    })
    console.log(artistGenres);
    return artistGenres;
  }
  getTrackArtists = (trackList) => {
      let trackArtists = []
      trackList.forEach(track => {
          track.artists.forEach(artist => {
              if (!trackArtists.includes(artist.name)) {
                  trackArtists.push(artist.name);
              }
          })
      })
      console.log(trackArtists);
      return trackArtists;
  }
  getTrackAlbums = (trackList) => {
      let trackAlbums = []
      trackList.forEach(track => {
          if (!trackAlbums.includes(track.album.name)) {
              trackAlbums.push(track.album.name);
          }
      })
      console.log(trackAlbums);
      return trackAlbums;
  }

  render() {
    return (
      <>
        <NavBar 
          userId={this.state.userId}
          spotifyId={this.state.spotifyId}
        />
        <Router>
          <Home 
            path="/" 
            handleLogin={this.handleLogin}
            handleLogout={this.handleLogout}
            userId={this.state.userId}
            spotifyId={this.state.spotifyId}
          />
          <Profile 
            path="/profile/:spotifyId"
            userId={this.state.userId} 
          />
          <Stats 
            path="/stats" 
            userId={this.state.userId}
            topTracks={this.state.topTracks}
            topArtists={this.state.topArtists}
            getArtistGenres={this.getArtistGenres}
            getTrackAlbums={this.getTrackAlbums}
            getTrackArtists={this.getTrackArtists}
          />
          <Friends 
            path="/friends/:spotifyId" 
            userId={this.state.userId}
            topTracks={this.state.topTracks}
            topArtists={this.state.topArtists}
            getArtistGenres={this.getArtistGenres}
            getTrackAlbums={this.getTrackAlbums}
            getTrackArtists={this.getTrackArtists}
          />
          <NotFound default />
        </Router>
      </>
    );
  }
}

export default App;
