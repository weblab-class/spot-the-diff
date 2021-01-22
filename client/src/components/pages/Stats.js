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

    getArtistGenres = (artistList) => {
        let artistGenres = []
        artistList.forEach(artist => {
            artist.genres.forEach(genre => {
                if (!artistGenres.includes(genre)) {
                    artistGenres.push(genre);
                }
            })
        })
        console.log(artistGenres);
    }
    getTrackArtists = (trackList) => {
        let trackArtists = []
        trackList.forEach(track => {
            track.artists.forEach(artist => {
                console.log(artist)
                if (!trackArtists.includes(artist.name)) {
                    trackArtists.push(artist.name);
                }
            })
        })
        console.log(trackArtists);
    }
    getTrackAlbums = (trackList) => {
        let trackAlbums = []
        trackList.forEach(track => {
            if (!trackAlbums.includes(track.album.name)) {
                trackAlbums.push(track.album.name);
            }
        })
        console.log(trackAlbums);
    }

    render() {
        if (!this.props.userId) return <div>Log in before accessing Stats</div>;

        if (!this.props.topTracks || !this.props.topArtists) {
            return <div> Loading! </div>;
        }

        return (
            <div>
                <button onClick={this.getArtistGenres(this.props.topArtists)}>get artist genres</button> 
                <button onClick={this.getTrackArtists(this.props.topTracks)}>get track artists</button>
                <button onClick={this.getTrackAlbums(this.props.topTracks)}>get track albums</button>
                <h1 className='u-centertext .xl-text'>Custom Listening Insights</h1>
                {
                    <>
                    <h2 className="Stats-center-text"> My Top Tracks</h2>
                    <div className="Stats-centering-tracks">
                    <TopTracks className="Stats-center-flex" data={this.props.topTracks}/>
                    </div>
                    <h2 className="Stats-center-text">My Top Artists</h2>
                    <TopArtists topArtists={this.props.topArtists} />
                    </>}
            </div>
        );
                }  
}

export default Stats;