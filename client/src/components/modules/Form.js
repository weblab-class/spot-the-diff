import React, { Component } from "react";
import "./Form.css";
import { get, post } from "../../utilities";

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

    addFriend = (userId) => {
        console.log('in correct function!')
        get("/api/getUser", {userId}).then((data) => {
            console.log(data);
            const friendName = data.display_name;
            post("/api/addFriend", {
                userId: userId,
                friendName: friendName,
            }).then((data) => {
                console.log(data);
            }).catch(err => {
                console.log(err);
            })
        }).catch(err => {
            console.log('error in addFriend in Form.js: ', err);
        }) 
    }

    handleChange(event) {
        this.setState({value : event.target.value});
    }

    handleSubmit(event) {
        // alert('A name was submitted: ' + this.state.value);
        event.preventDefault();

        let isValidUser = false;
        get("/api/user", {spotifyId: this.state.value}).then((data) => {
            console.log(data);
            if (data.data == 'error') {
                alert(`user "${this.state.value}" not in database. please enter a different friend id.`);
            }
            else {
                isValidUser = true;
            }
        }
            // function (user) { 
            //     console.log('successful', user);
            //     isValidUser = true; 
            // },
            // function (err) { 
            //     console.log('error: ', err);
            //     alert('no user in database');
            // }
        ).then(() => {
            if (isValidUser == false) {
                return;
            }
            else {
                this.addFriend(this.state.value);
                this.props.onSubmit(this.state.value);

                // this.props.compareArtists(this.state.value);
                // this.props.compareTracks(this.state.value);
                // this.props.pickFriend(this.state.value);
    
                console.log('handlesubmit')
            }
        }).catch(err => {
            console.log(err);
        })
        
        
    }

render() {
    
    return (
        <form onSubmit={this.handleSubmit}>
            <label htmlFor="fname">Enter a friend's spotify ID:</label><br/>
            <div className="Form-div">
                <input type="text" id="fname" name="fname" className="Form-input" value={this.state.value} onChange={this.handleChange} /><br/>
                <input type="submit" className="Form-submit" value="Enter"></input>
            </div>
        </form>
    )
    }
}

export default Form;
  