const mongoose = require("mongoose");

const TopTracksSchema = new mongoose.Schema({
    spotifyId: String,
    tracks: Array,
});

// compile model from schema
module.exports = mongoose.model("topTracks", TopTracksSchema);