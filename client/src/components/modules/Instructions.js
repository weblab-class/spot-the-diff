import React, { Component } from "react";
import "./Instructions.css";

class Instructions extends Component {
    constructor(props) {
      super(props);
    }

render() {
    return (
        <>
        <input type="checkbox" id="toggle" />
        <label className="Instructions-label" htmlFor="toggle">Instructions</label>
        <dialog>
        <p>To compare your stats with your friends, make sure they have logged into our website before. Enter their Spotify ID (can be viewed in the top left of the screen in brackets) into the input field. <br/> <br/> No friends yet? No problem, we will be your friend! Use the following IDs: <b>krishnahibye</b>, <b>helen_hu</b>, and <b>llr5ecqygx3g5iqkx9lfnqzmt</b>.</p>
        <label className="Instructions-label" htmlFor="toggle">Close</label>
        </dialog>
        </>
    )
    }
}

export default Instructions;
  