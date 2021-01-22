const mongoose = require("mongoose");

const FriendsSchema = new mongoose.Schema({
    userId: String,
    friendsList: [Array],
});

// compile model from schema
module.exports = mongoose.model("friends", FriendsSchema);