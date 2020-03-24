const mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');


var shareRidePostsSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    pickUp: {
        type: String,
        required: true
    },
    dropOff: {
        type: String,
        required: true
    },
    radius: {
        type: String,
        required: true
    },
    perKm: {
        type: String,
        required: true
    },
    smoking: {
        type: Boolean,
        required: true
    },
    luggage: {
        type: Boolean,
        required: true
    },
    seats: {
        type: Number,
        required: true
    },
    usermessage: {
        type: String,
        required: true
    },
    date: {
        type: Number,
        required: true
    },
});

module.exports = mongoose.model("shareRide", shareRidePostsSchema);