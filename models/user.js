const mongoose = require("mongoose");
const { Schema } = mongoose;

const users = mongoose.model(
    "users",
    new Schema({
        // _id: String,  // TODO need to make optional
        name: String,
        surname: String,
        email: String,
        password: String,
        dateOfBirth: Date,
        gender: String,
        wishListItems: Array,
        cartItems: Array
    })
);

module.exports = users;