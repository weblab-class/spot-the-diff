const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  spotifyId: String,
});

// compile model from schema
module.exports = mongoose.model("user", UserSchema);
