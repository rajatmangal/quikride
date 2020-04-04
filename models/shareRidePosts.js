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
    },
    smoking: {
        type: String,
        required: true
    },
    luggage: {
        type: String,
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
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    profilePic:{
        type: String,
        default: ''
    }
});

shareRidePostsSchema.index({"pickUpPoint": "2dsphere"});
shareRidePostsSchema.index({"dropOffPoint": "2dsphere"});

module.exports = mongoose.model("shareRide", shareRidePostsSchema);