const mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');


var rideRating = new mongoose.Schema({
    rideRequestId: {
        type: String,
        required: true
    },
    rider: {
        type: String,
        required: true
    },
    rating: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model("rideRating", rideRating);