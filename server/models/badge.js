const mongoose = require("mongoose");

const BadgeSchema = new mongoose.Schema({
    userId: String,
    title: String,
    category: String,
});

// compile model from schema
module.exports = mongoose.model("badge", BadgeSchema);