import React, { Component } from "react";
import "./Form.css";

/**
 * Proptypes
 * @param {(event) => ()} compareArtists
 * @param {(event) => {}} compareTracks
 */
class Form extends Component {
    constructor(props) {
        super(props);
        this.state = {
            value: ""
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({value : event.target.value});
    }

    handleSubmit(event) {
        alert('A name was submitted: ' + this.state.value);
        event.preventDefault();
        this.props.compareArtists(this.state.value);
        this.props.compareTracks(this.state.value);
    }

render() {
    
    return (
        <form onSubmit={this.handleSubmit}>
            <h3>To compare your stats with your friends...</h3>
            <ul>
                <li>make sure they've logged into our website before</li>
                <li>your spotify ID can be found on the home page, right under the logout button!</li>
            </ul>
            <label htmlFor="fname">Enter a friend's spotify ID:</label><br/>
            <input type="text" id="fname" name="fname" value={this.state.value} onChange={this.handleChange} /><br/>
            <input type="submit"></input>
        </form>
    )
    }
}

export default Form;
  