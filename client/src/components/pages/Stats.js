import React, { Component } from "react";
import { get, post } from "../../utilities";

import "../../utilities.css";
import TopTracks from "../modules/TopTracks";
import TopArtists from "../modules/TopArtists";
import Card from "../modules/Card";
import Form from "../modules/Form"

import "./Stats.css";

class Stats extends Component {
    constructor(props) {
        super(props);
        this.state = {
            topTracks: [],
            topArtists: [],
            // can test with 'krishnahibye' or 'helen_hu'
            otherId: '',
            friendArtists: null,
            friendTracks: null,
            compatibility: undefined,
        };
    }

    componentDidMount() {
        // get("/api/topTracks").then((data) => {
        //     console.log('my top tracks: ', data);
        //     this.setState({ 
        //         topTracks: data, 
        //     });
        // });

        // get("/api/topArtists").then((data) => {
        //     console.log('my top artists: ', data);
        //     this.setState({
        //         topArtists: data,
        //     })
        // }); 
    }

    // handleCompare = () => {
    //     const intersect = (arrA, arrB) => {
    //         return arrA.filter(x => arrB.some(y => y.id === x.id));
    //     }
    //     const tracksA = this.props.topTracks;
    //     const tracksB = this.state.friendTracks;
    //     const artistsA = this.props.topArtists;
    //     const artistsB = this.state.friendArtists;

    //     const commonTracks = intersect(tracksA, tracksB);
    //     const commonArtists = intersect(artistsA, artistsB);

    //     console.log('common tracks: ', commonTracks);
    //     console.log('common artists: ', commonArtists);

    //     const tracks_pts = 2*commonTracks.length / (tracksA.length + tracksB.length);
    //     const artists_pts = 2*commonArtists.length / (artistsA.length + artistsB.length);

    //     const total_pts = 100 * (tracks_pts + artists_pts)/2;

    //     console.log(total_pts);
    //     this.setState({
    //         compatibility: total_pts,
    //     });
    // }

    render() {
        if (!this.props.userId) return <div>Log in before accessing Stats</div>;

        if (!this.props.topTracks || !this.props.topArtists) {
            return <div> Loading! </div>;
        }

        return (
            <div>
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