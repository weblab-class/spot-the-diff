const mongoose = require("mongoose");

const TopTracksSchema = new mongoose.Schema({
    userId: String,
    trackList: Array,
    timeRange: String,  // valid values: 'long_term', 'medium_term', 'short_term'
});

// compile model from schema
module.exports = mongoose.model("topTracks", TopTracksSchema);