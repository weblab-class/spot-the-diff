import React, { Component } from "react";

import "../../utilities.css";
import "./Login.css";

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: undefined,
        };
    }

    render() {
        return (
            <div>
                <h1>welcome! login to spotify to get started.</h1>
                <h3>or, learn more about us first.</h3>
                <button>Login</button>
            </div>
        );
    }
}

export default Login;