const mongoose = require("mongoose");

const TopTracksSchema = new mongoose.Schema({
    userId: String,
    trackList: Array,
});

// compile model from schema
module.exports = mongoose.model("topTracks", TopTracksSchema);