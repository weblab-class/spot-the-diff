const mongoose = require("mongoose");

const TopTracksSchema = new mongoose.Schema({
    userId: String,
    trackList: Array,
    timeRange: String,  // valid values: 'long', 'medium', 'short'
});

// compile model from schema
module.exports = mongoose.model("topTracks", TopTracksSchema);