const mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var postsSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    pickuplocation: {
        type: String,
        required: true
    },
    pickupLocationLat: {
        type: String,
        required: false
    },
    pickupLocationLng: {
        type: String,
        required: false
    },
    dropofflocation: {
        type: String,
        required: true
    },
    dropoffLocationLat: {
        type: String,
        required: false
    },
    dropoffLocationLng: {
        type: String,
        required: false
    },
    usermessage: {
        type: String,
        required: true
    },
    ridecost: {
        type: Number,
        required: true
    }
});

module.exports = mongoose.model("posts", postsSchema);