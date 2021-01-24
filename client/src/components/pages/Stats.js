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
        };
    }

    componentDidMount() {
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

        if (!this.props.topTracks || !this.props.topArtists) {
            return <div> Loading! </div>;
        }

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
            <div>
                <button onClick={this.onShort}>4 weeks</button> 
                <button onClick={this.onMed}>6 months</button>
                <button onClick={this.onLong}>all time</button>
                <h1 className='u-centertext .xl-text'>Custom Listening Insights</h1>
                {
                    <>
                    <h2 className="Stats-center-text"> My Top Tracks</h2>
                    <div className="Stats-centering-tracks">
                    <TopTracks className="Stats-center-flex" data={topTracks}/>
                    </div>
                    <h2 className="Stats-center-text">My Top Artists</h2>
                    <div className="Stats-centering-tracks">
                    <TopArtists className="Stats-center-flex" topArtists={topArtists} />
                    </div>
                    </>}
            </div>
        );
    }  
}

export default Stats;