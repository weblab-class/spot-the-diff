const mongoose = require("mongoose");

const TopArtistsSchema = new mongoose.Schema({
    userId: String,
    artistList: Array,
    timeRange: String,  // valid values: 'long_term', 'medium_term', 'short_term'
});

// compile model from schema
module.exports = mongoose.model("topArtists", TopArtistsSchema);