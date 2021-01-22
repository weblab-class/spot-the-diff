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
 * @param {array} topTracks
 * @param {array} topArtists
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
        };
    }

    componentDidMount() {
    }

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

        return (
            <div>
                <button onClick={this.onArtistGenres}>get artist genres</button> 
                <button onClick={this.onTrackArtists}>get track artists</button>
                <button onClick={this.onTrackAlbums}>get track albums</button>
                <h1 className='u-centertext .xl-text'>Custom Listening Insights</h1>
                {
                <div className="flex-row">
                    <div className="flex-column">
                        <h2 className='u-centertext'>My Top Tracks</h2>
                        <TopTracks data={this.props.topTracks}/>
                        <h2 className='u-centertext'>My Top Artists</h2>
                        <TopArtists topArtists={this.props.topArtists} />
                    </div>
                </div>}
            </div>
        );
    }
}

export default Stats;