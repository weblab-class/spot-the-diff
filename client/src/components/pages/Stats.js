import React, { Component } from "react";
import { get, post } from "../../utilities";

import "../../utilities.css";
import TopTracks from "../modules/TopTracks";
import TopArtists from "../modules/TopArtists";
import Card from "../modules/Card";
import Form from "../modules/Form"
import Friends from "./Friends";

import "./Stats.css";
/**
 * Proptypes
 * @param {String} userId
 * @param {array} topTracks, topTracksShort, topTracksLong
 * @param {array} topArtists, topArtistsShort, topArtistsLong
 * @param {function} getArtistGenres
 * @param {function} getTrackAlbums
 * @param {function} getTrackArtists
 */
class Stats extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // can test with 'krishnahibye' or 'helen_hu'
            otherId: '',
            friendArtists: null,
            friendTracks: null,
            compatibility: undefined,
            timeRange: 'med',
            user: null,
        };
    }

    componentDidMount() {
        get("/api/getMe").then((data) => {
            console.log(data);
            this.setState({
                user: data,
            })
        });
    }

    onShort = () => {
        this.setState({
            timeRange: 'short',
        })
    }
    onMed = () => {
        this.setState({
            timeRange: 'med',
        })
    }
    onLong = () => {
        this.setState({
            timeRange: 'long',
        })
    }

    // these r for testing
    onArtistGenres = () => {
        this.props.getArtistGenres(this.props.topArtists);
    }
    onTrackArtists = () => {
        this.props.getTrackArtists(this.props.topTracks);
    }
    onTrackAlbums = () => {
        this.props.getTrackAlbums(this.props.topTracks);
    }

    render() {
        if (!this.props.userId) return <div>Log in before accessing Stats</div>;
        if (!this.state.user) {
            return <div> Log in before accessing Stats! </div>;
        }

        if (!this.props.topTracks || !this.props.topArtists) {
            return <div> Loading! </div>;
        }

        const username = this.state.user.display_name;
        const userIcon = this.state.user.images[0].url;

        let topTracks;
        let topArtists;
        if (this.state.timeRange === 'short') {
            topTracks = this.props.topTracksShort;
            topArtists = this.props.topArtistsShort;
        }
        else if (this.state.timeRange === 'long') {
            topTracks = this.props.topTracksLong;
            topArtists = this.props.topArtistsLong;
        }
        else {
            topTracks = this.props.topTracks;
            topArtists = this.props.topArtists;
        }

        return (
            <div className="Stats-page">
                <div className='Stats-sidebar'>
                    <div className="Stats-spacing"></div>
                    <h1 className='Stats-title'>hi, {username}!</h1>
                    <h1 className="Stats-title">your music looks good🤩</h1>
                    <figure>
                        <img src={userIcon} className='Stats-img'/>
                        <figcaption>and so do you ;)</figcaption>
                    </figure>
                    <div className="Stats-button-group">
                        <button className="Stats-button Stats-button1" onClick={this.onShort}>4 weeks</button> 
                        <button className="Stats-button Stats-button2" onClick={this.onMed}>6 months</button>
                        <button className="Stats-button Stats-button3" onClick={this.onLong}>all time</button>
                    </div>
                </div>
                <div className="Stats-content">
                    <h2 className = "Stats-title"> My Top Tracks </h2>
                    <div className="Stats-centering-tracks">
                    <TopTracks className="Stats-center-flex" data={topTracks}/>
                    </div>
                    <h2 className="Stats-title">My Top Artists</h2>
                    <div className="Stats-centering-tracks">
                    <TopArtists className="Stats-center-flex" topArtists={topArtists} />
                    </div>
                </div>
            </div>
        );
    }  
}

export default Stats;