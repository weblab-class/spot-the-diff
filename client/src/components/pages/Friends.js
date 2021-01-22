import React, { Component } from "react";
import { get, post } from "../../utilities";

import "../../utilities.css";
import TopTracks from "../modules/TopTracks";
import TopArtists from "../modules/TopArtists";
import Card from "../modules/Card";
import Form from "../modules/Form"

import "./Friends.css";

class Friends extends Component {
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
}

handleCompare = () => {
    const intersect = (arrA, arrB) => {
        return arrA.filter(x => arrB.some(y => y.id === x.id));
    }
    const tracksA = this.props.topTracks;
    const tracksB = this.state.friendTracks;
    const artistsA = this.props.topArtists;
    const artistsB = this.state.friendArtists;

    const commonTracks = intersect(tracksA, tracksB);
    const commonArtists = intersect(artistsA, artistsB);

    console.log('common tracks: ', commonTracks);
    console.log('common artists: ', commonArtists);

    const tracks_pts = 2*commonTracks.length / (tracksA.length + tracksB.length);
    const artists_pts = 2*commonArtists.length / (artistsA.length + artistsB.length);

    const total_pts = 100 * (tracks_pts + artists_pts)/2;

    console.log(total_pts);
    this.setState({
        compatibility: total_pts,
    });
}
    

