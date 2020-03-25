const mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');


var ridesSchema = new mongoose.Schema({
    rider: {
        type: String,
        required: true
    },
    driver: {
        type: String,
        required: true
    },
    message: {
        type: String,
    },
    pickup: {
        type: String,
        required: true
    },
    dropoff: {
        type: String,
        required: true
    },
    id: {
        type: String,
        required: true
    },
    status:{
        type: String,
        required: true
    }
});

module.exports = mongoose.model("ride", ridesSchema);