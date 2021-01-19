import React, { Component } from "react";
import { Router } from "@reach/router";
import NotFound from "./pages/NotFound.js";
import Skeleton from "./pages/Skeleton.js";
import Login from "./pages/Login.js";
import NavBar from "./modules/NavBar.js";
import About from "./pages/About.js"
import Home from "./pages/Home.js"
import Profile from "./pages/Profile.js"
import Stats from "./pages/Stats.js"

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
    };
  }

  componentDidMount() {
    console.log('in componentDidMount');
    

    get("/api/whoami").then((user) => {
      console.log('in whoami')
      if (user._id) {
        // they are registed in the database, and currently logged in.
        console.log('user id is', user._id);
        this.setState({ userId: user._id });
      }
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

  render() {
    return (
      <>
        <NavBar 
          userId={this.state.userId}
        />
        <Router>
          <Login 
            path="/" 
            handleLogin={this.handleLogin}
            handleLogout={this.handleLogout}
            userId={this.state.userId}
          />
          {/* TODO: replace w '/profile:userId' and change accordingly in navbar.js */}
          <Profile path="/profile" />
          <Stats path="/stats" />
          <About path="/about" />
          <Home path="/home" />
          <NotFound default />
        </Router>
      </>
    );
  }
}

export default App;
