const mongoose = require("mongoose");

const TopArtistsSchema = new mongoose.Schema({
    userId: String,
    artistList: Array,
});

// compile model from schema
module.exports = mongoose.model("topArtists", TopArtistsSchema);