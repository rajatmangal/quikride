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
    pickUpPoint: {
        type: { type: String },
        coordinates: []
    },
    dropOff: {
        type: String,
        required: true
    },
    dropOffPoint: {
        type: { type: String },
        coordinates: []
    },
    radius: {
        type: String,
        required: true
    },
    perKm: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("shareRide", shareRidePostsSchema);