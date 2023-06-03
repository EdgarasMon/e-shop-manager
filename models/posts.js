const mongoose = require("mongoose");
const { Schema } = mongoose;

const posts = mongoose.model(
    "posts",
    new Schema({
        // userId: String,
        post: String,
        timeAndDateAdded: String,
    })
);

module.exports = posts;