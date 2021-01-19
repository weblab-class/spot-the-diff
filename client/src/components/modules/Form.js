import React, { Component } from "react";
import "./Form.css";

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
            <label for="fname">Enter a friend's username:</label><br/>
            <input type="text" id="fname" name="fname" value={this.state.value} onChange={this.handleChange} /><br/>
            <input type="submit"></input>
        </form>
    )
    }
}

export default Form;
  