const mongoose = require("mongoose");
const { Schema } = mongoose;

const items = mongoose.model(
    "items",
    new Schema({
        name: String,
        description: String,
        specification: String,
        price: Number,
        type: String,
        brand: String,
        model: String,
        color: String,
    })
);

module.exports = items;