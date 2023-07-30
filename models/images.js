const mongoose = require("mongoose");
const { Schema } = mongoose;

const images = mongoose.model(
    "images",
    new Schema({
        name: String,
        data: Buffer,
        itemId: String,
    })
);

module.exports = images;