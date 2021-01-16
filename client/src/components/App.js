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
    // get("/api/whoami").then((data) => {
    //   // console.log('here');
    //   // console.log(data);
    // });
  }

  handleLogin = (res) => {
    console.log(`Logged in as ${res.profileObj.name}`);
    const userToken = res.tokenObj.id_token;
    post("/api/login", { token: userToken }).then((user) => {
      this.setState({ userId: user._id });
      post("/api/initsocket", { socketid: socket.id });
    });
  };

  handleLogout = () => {
    this.setState({ userId: undefined });
    post("/api/logout");
  };

  render() {
    return (
      <>
        <NavBar />
        <Router>
          {/* <Skeleton
            path="/"
            handleLogin={this.handleLogin}
            handleLogout={this.handleLogout}
            userId={this.state.userId}
          />
          <Login path="/login" />
          <Home path="/" />
          <Stats path="/" />
          <About path="/" />
          <Profile path="/" />
          /> */}
          <Login path="/" />
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
