const mongoose = require("mongoose");

const FriendsSchema = new mongoose.Schema({
    userId: String,
    friendsList: [{userId: String, friendName: String, rating: Number}],
});

// compile model from schema
module.exports = mongoose.model("friends", FriendsSchema);